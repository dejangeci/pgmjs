#!/usr/bin/env node

const path = require("path");

const dotenv = require("dotenv");
const program = require("commander");
const chalk = require("chalk");

const pkg = require("../package.json");
const constants = require("../lib/constants");
const util = require("../lib/util");
const migration = require("../lib/migration");
const { Config } = require("../lib/config");
const { PGMClient } = require("../lib/pgm-client.js");

let log = console.log;

// Helpers

function handleError(message) {
  log(chalk.red(`ERROR: ${message}`));
  process.exitCode = 1;
}

async function resolveConfiguration(options) {
  const config = new Config();

  const defaultConfigFile = path.resolve("pgm.json");
  const defaultConfigFileExists = await util.fileExists(defaultConfigFile);
  const shouldLoadConfig = options.parent.config !== false;
  const configFileSpecified = typeof options.parent.config === "string";

  const defaultDotenvFile = path.resolve(".env");
  const defaultDotenvFileExists = await util.fileExists(defaultDotenvFile);
  const shouldLoadDotenv = options.parent.dotenv !== false;
  const configDotenvSpecified = typeof options.parent.dotenv === "string";

  if (shouldLoadConfig && configFileSpecified) {
    const configContents = await util.getFileContents(path.resolve(options.parent.config));
    const configJson = JSON.parse(configContents);
    config.loadFromJSON(configJson);
  } else if (shouldLoadDotenv && configDotenvSpecified) {
    await util.getFileContents(options.parent.dotenv); // validate file exists
    dotenv.config({ path: options.parent.dotenv });
    config.loadFromEnv();
  } else if (shouldLoadConfig && defaultConfigFileExists) {
    const configContents = await util.getFileContents(defaultConfigFile);
    const configJson = JSON.parse(configContents);
    config.loadFromJSON(configJson);
  } else if (shouldLoadDotenv && defaultDotenvFileExists) {
    dotenv.config({ path: defaultDotenvFile });
    config.loadFromEnv();
  } else {
    config.loadFromEnv();
  }

  return config.get();
}

// Commands

program
  .version(pkg.version)
  .description(pkg.description)
  .option("-c, --config <file>", "specify json configuration file")
  .option("-C, --no-config", "don't load pgm.json configuration")
  .option("-d, --dotenv <file>", "specify dotenv configuration file")
  .option("-D, --no-dotenv", "don't load .env configuration")
  .option("-q, --quiet", "disable output messages");

program
  .command("make [name...]")
  .alias("create")
  .description("create a migration with optional name")
  .action(async (name, options) => {
    try {
      const config = await resolveConfiguration(options);

      await util.ensureDirectory(config.migrationsDirectory);

      const existingMigrations = await util.getFiles(config.migrationsDirectory, constants.MIGRATION_FILENAME_REGEX);
      const filename = migration.generateNextMigrationFilename(existingMigrations, name.join(" "));
      await util.createEmptyFile(path.resolve(config.migrationsDirectory, filename));

      log(chalk.green("Created: ") + path.basename(filename));
    } catch (err) {
      handleError(err.message);
    }
  });

program
  .command("stat")
  .alias("status")
  .description("print current migration status")
  .action(async options => {
    let client;
    try {
      const config = await resolveConfiguration(options);
      client = new PGMClient(config);

      await client.connect();

      const appliedMigrations = await client.getAppliedMigrations();
      const localMigrations = await migration.getLocalMigrations(config.migrationsDirectory);
      migration.validateStateConsistency(appliedMigrations, localMigrations);

      const pendingMigrations = migration.getPendingMigrations(appliedMigrations, localMigrations);

      log(chalk.green(`Applied migrations: ${appliedMigrations.length}`));
      log(chalk.yellow(`Pending migrations: ${pendingMigrations.length}`));
      if (appliedMigrations.length || pendingMigrations.length) log();
      appliedMigrations.forEach(m => log(chalk.green("Applied: ") + m.filename));
      pendingMigrations.forEach(m => log(chalk.yellow("Pending: ") + m.filename));
    } catch (err) {
      handleError(err.message);
    } finally {
      if (client) await client.disconnect();
    }
  });

program
  .command("up [seq]")
  .alias("migrate")
  .description("apply all, or up to [seq] pending migrations")
  .action(async (seq, options) => {
    let client;
    try {
      const seqSpecified = !!seq;
      if (seqSpecified && !util.isPositiveInteger(seq)) throw new Error("Provided value is not a positive integer");
      seq = parseInt(seq, 10);

      const config = await resolveConfiguration(options);
      client = new PGMClient(config);

      await client.connect();
      await client.ensureMigrationsTable();

      const appliedMigrations = await client.getAppliedMigrations();
      const localMigrations = await migration.getLocalMigrations(config.migrationsDirectory);
      migration.validateStateConsistency(appliedMigrations, localMigrations);

      const pendingMigrations = migration.getPendingMigrations(appliedMigrations, localMigrations);

      if (seqSpecified && !pendingMigrations.filter(x => x.seq === seq).length)
        throw new Error("Specified migration is not pending");

      if (pendingMigrations.length === 0) {
        log("No pending migrations");
        return;
      }

      try {
        await client.beginTransaction();

        for (let i = 0; i < pendingMigrations.length; i++) {
          const migration = pendingMigrations[i];

          log(chalk.yellow("Applying: ") + migration.filename);
          await client.applyMigration(migration);
          if (seqSpecified && migration.seq === seq) break;
        }

        await client.completeTransaction();
        log(chalk.green("Successfully applied migration(s)"));
      } catch (err) {
        handleError(err.message);
        log("Rolling back all changes");
        await client.rollbackTransaction();
        log(chalk.yellow("Rolled back successfully"));
      }
    } catch (err) {
      handleError(err.message);
    } finally {
      if (client) await client.disconnect();
    }
  });

// Handlers

program.on("option:quiet", function() {
  log = () => {};
});

program.on("--help", function() {
  log("");
  log("Examples:");
  log("  $ pgm make");
  log("  $ pgm make create users table");
  log("  $ pgm stat");
  log("  $ pgm up 5    # apply up to, and including 005.sql");
  log("  $ pgm up      # apply all pending");
});

program.on("command:*", function() {
  handleError(`Invalid command: ${program.args.join(" ")}\nSee --help for a list of available commands`);
});

// Execute

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
