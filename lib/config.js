class Config {
  constructor() {
    this.options = this.getDefaults();
  }

  getDefaults() {
    return {
      host: "localhost",
      port: 5432,
      database: "postgres",
      user: "postgres",
      password: "",
      migrationsDirectory: "migrations",
      migrationsTable: "public.migrations",
    };
  }

  loadFromEnv() {
    this.options.host = process.env.POSTGRES_HOST || this.options.host;
    this.options.port = process.env.POSTGRES_PORT || this.options.port;
    this.options.database = process.env.POSTGRES_DB || this.options.database;
    this.options.user = process.env.POSTGRES_USER || this.options.user;
    this.options.password = process.env.POSTGRES_PASSWORD || this.options.password;
    this.options.migrationsDirectory = process.env.PGM_MIGRATIONS_DIRECTORY || this.options.migrationsDirectory;
    this.options.migrationsTable = process.env.PGM_MIGRATIONS_TABLE || this.options.migrationsTable;

    return this;
  }

  loadFromJSON(obj) {
    this.options.host = obj.host || this.options.host;
    this.options.port = obj.port || this.options.port;
    this.options.database = obj.database || this.options.database;
    this.options.user = obj.user || this.options.user;
    this.options.password = obj.password || this.options.password;
    this.options.migrationsDirectory = obj.migrationsDirectory || this.options.migrationsDirectory;
    this.options.migrationsTable = obj.migrationsTable || this.options.migrationsTable;

    return this;
  }

  get() {
    return this.options;
  }
}

module.exports.Config = Config;
