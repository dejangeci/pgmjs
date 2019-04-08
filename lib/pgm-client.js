const { Client } = require("pg");

class PGMClient {
  constructor(options) {
    this.options = options;
  }

  connect() {
    if (!this.client) this.client = new Client(this.options);

    return this.client.connect();
  }

  disconnect() {
    return this.client.end();
  }

  beginTransaction() {
    return this.client.query("BEGIN");
  }

  completeTransaction() {
    return this.client.query("COMMIT");
  }

  rollbackTransaction() {
    return this.client.query("ROLLBACK");
  }

  ensureMigrationsTable() {
    return this.client.query(
      `CREATE TABLE IF NOT EXISTS ${this.options.migrationsTable} (
        "seq" int4 NOT NULL,
        "filename" varchar NOT NULL,
        "hash" varchar(32) NOT NULL,
        "applied_on" timestamptz NOT NULL,

        CONSTRAINT "${this.options.migrationsTable}_seq_key" UNIQUE ("seq"),
        CONSTRAINT "${this.options.migrationsTable}_filename_key" UNIQUE ("filename")
      );`
    );
  }

  async getAppliedMigrations() {
    return (await this.client.query(
      `SELECT "seq", "filename", "hash" FROM ${this.options.migrationsTable} ORDER BY "seq" ASC`
    )).rows;
  }

  applyMigration(migration) {
    return this.client
      .query(migration.contents)
      .then(() =>
        this.client.query(
          `INSERT INTO ${
            this.options.migrationsTable
          } ("seq", "filename", "hash", "applied_on") VALUES($1, $2, $3, NOW());`,
          [migration.seq, migration.filename, migration.hash]
        )
      );
  }
}

module.exports.PGMClient = PGMClient;
