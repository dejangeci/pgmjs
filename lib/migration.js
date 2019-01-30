const path = require("path");
const constants = require("./constants");
const util = require("./util");

function sequenceSortAsc(a, b) {
  return a.seq - b.seq;
}

function migrationComparer(otherArray) {
  return function(current) {
    return (
      otherArray.filter(function(other) {
        return other.filename == current.filename && other.hash == current.hash;
      }).length == 0
    );
  };
}

function extractSequenceFromFilename(filename) {
  const basename = util.stripFilenameExtension(filename, "sql");

  const sequencePart = filename.includes(constants.FILENAME_SEPARATOR)
    ? basename.split(constants.FILENAME_SEPARATOR)[0]
    : basename;

  return parseInt(sequencePart);
}

async function calculateMetadata(dir, migrationFilenames) {
  const migrations = [];
  for (let i = 0; i < migrationFilenames.length; i++) {
    const filename = migrationFilenames[i];
    const seq = extractSequenceFromFilename(filename);
    const contents = await util.getFileContents(path.resolve(dir, filename));
    const hash = util.calculateHash(contents);

    migrations.push({ filename, seq, contents, hash });
  }

  return migrations;
}

async function getLocalMigrations(dir) {
  const localFiles = await util.getFiles(dir, constants.MIGRATION_FILENAME_REGEX);
  const migrations = await calculateMetadata(dir, localFiles);

  return migrations;
}

function getPendingMigrations(appliedMigrations, localMigrations) {
  const diffMigrations = localMigrations.filter(migrationComparer(appliedMigrations));
  let pendingMigrations = diffMigrations.sort(sequenceSortAsc);

  return pendingMigrations;
}

function generateNextMigrationFilename(filenames, name = "") {
  const sequence = filenames.map(x => extractSequenceFromFilename(x));
  const nextInSequence = util.calculateNextInSequence(sequence);
  const sequencePart = nextInSequence.toString().padStart(3, "0");

  const safeFilename = util.cleanFilename(name);

  const filename =
    safeFilename.length > 0
      ? `${sequencePart}${constants.FILENAME_SEPARATOR}${safeFilename}.sql`
      : `${sequencePart}.sql`;

  return filename;
}

function getDuplicateSequenceMigrations(migrations) {
  const sequence = migrations.map(x => x.seq);
  const duplicates = util.getDuplicateElements(sequence);

  return migrations.filter(x => duplicates.includes(x.seq));
}

function validateStateConsistency(appliedMigrations, localMigrations) {
  const duplicates = getDuplicateSequenceMigrations(localMigrations);
  const offendingFiles = duplicates.map(x => x.filename).join(", ");

  if (duplicates.length > 0)
    throw new Error(`Inconsistent migration state: found migrations with duplicate sequence (${offendingFiles})`);

  const sortedAppliedMigrations = appliedMigrations.sort(sequenceSortAsc);
  const sortedLocalMigrations = localMigrations.sort(sequenceSortAsc);

  for (let i = 0; i < sortedAppliedMigrations.length; i++) {
    const applied = sortedAppliedMigrations[i];
    const local = sortedLocalMigrations[i];

    if (!local) {
      throw new Error(`Inconsistent migration state: missing ${applied.filename} that was previously applied`);
    } else if (applied.filename !== local.filename) {
      throw new Error(`Inconsistent migration state: expected ${applied.filename} but found ${local.filename} locally`);
    } else if (applied.hash !== local.hash) {
      throw new Error(`Inconsistent migration state: ${local.filename} was modified after it was applied`);
    }
  }
}

module.exports = {
  sequenceSortAsc,
  migrationComparer,
  extractSequenceFromFilename,
  calculateMetadata,
  getLocalMigrations,
  getPendingMigrations,
  generateNextMigrationFilename,
  getDuplicateSequenceMigrations,
  validateStateConsistency
};
