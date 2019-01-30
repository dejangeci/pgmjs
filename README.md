# pgm

[![ISC License](https://img.shields.io/npm/l/pgm.svg?style=flat)](https://opensource.org/licenses/ISC) [![NPM Version](http://img.shields.io/npm/v/pgm.svg?style=flat)](https://www.npmjs.org/package/pgm) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier) [![Blazing Fast](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg?style=flat)](https://twitter.com/acdlite/status/974390255393505280)

Simple migration tool for PostgreSQL

## Installation

```shell
npm install pgm             # local, usage: npx pgm [params]
# or
npm install pgm --save-dev  # devDependencies, usage: npx pgm [params]
# or
npm install pgm --global    # global, usage: pgm [params]
```

## Requirements

- [Node 8.2+](https://nodejs.org/en/)
- [PostgreSQL 9.1+](https://www.postgresql.org/)

## How it works

pgm only tracks and applies `.sql` files. It does not generate any sql.

Use another tool like [Adminer](https://www.adminer.org/) or [DBeaver](https://dbeaver.io/) to model the schema and generate sql to place inside migration files.

## Quick example

```shell
pgm make              # create migration 001.sql
pgm up                # migrate
pgm make another one  # create migration 002-another-one.sql
pgm stat              # show current status

----------------------------
Applied migrations: 1
Pending migrations: 1

Applied: 001.sql
Pending: 002-another-one.sql
----------------------------
```

## CLI

```
Usage: pgm [options] [command]

Simple migration tool for PostgreSQL

Options:
  -V, --version          output the version number
  -c, --config <file>    specify json configuration file
  -C, --no-config        don't load pgm.json configuration
  -d, --dotenv <file>    specify dotenv configuration file
  -D, --no-dotenv        don't load .env configuration
  -q, --quiet            disable output messages
  -h, --help             output usage information

Commands:
  make|create [name...]  create a migration with optional name
  stat|status            print current migration status
  up|migrate [seq]       apply all, or up to [seq] pending migrations

Examples:
  $ pgm make
  $ pgm make create users table
  $ pgm stat
  $ pgm up
  $ pgm up 5
```

## Configuration

If no CLI options are specified, pgm will try to load `pgm.json` if it exists. Otherwise `.env` will be loaded using [dotenv](https://www.npmjs.com/package/dotenv).
To explicitly load a configuration, use `--config custom.json` or `--dotenv .custom.env`.

Settings are then read from json configuration or `process.env` depending on the options.

Schema and table can be specified using `"migrationsTable": "custom_schema.custom_table"`.

> **Tip:** To skip loading both `pgm.json` and `.env`, and only use `process.env` variables, specify both `--no-config --no-dotenv` CLI options.

### pgm.json example

```json
{
  "host": "localhost",
  "port": "5432",
  "database": "postgres",
  "user": "postgres",
  "password": "",
  "migrationsDirectory": "migrations",
  "migrationsTable": "public.migrations"
}
```

> **Tip:** To include double quotes, escape them with backslashes `"migrationsTable": "\"public\".\"migrations\""`

### .env example

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=
PGM_MIGRATIONS_DIRECTORY=migrations
PGM_MIGRATIONS_TABLE=public.migrations
```

> **Tip:** To include double quotes, wrap them in single quotes: `PGM_MIGRATIONS_TABLE='"public"."migrations"'`

## Rules

- There are no down migrations
- Two migrations cannot start with the same sequence number
- Do not modify or rename migrations after they have been applied
- All pending migrations are applied in a transaction

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

See [LICENSE](LICENSE) (ISC)
