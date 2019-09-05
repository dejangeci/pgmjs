# Run example

1. Install dependencies

   ```
   npm install
   ```

2. Start docker containers

   ```shell
   docker-compose up -d
   ```

3. Execute PGM commands

   ```shell
   npx pgm up 1   # migrate to 001-create-users-table.sql
   npx pgm up 3   # migrate to 003-create-role-table.sql
   npx pgm stat   # check migration status
   npx pgm up     # apply all pending migrations
   ```

   Configuration usage examples:

   ```shell
   npx pgm --no-config stat               # don't use pgm.json (uses .env by default)
   npx pgm --no-dotenv stat               # don't use .env (uses pgm.json by default)
   npx pgm --no-config --no-dotenv stat   # don't use pgm.json or .env (uses environment variables by default)
   npx pgm --config pgm-alt.json stat     # use pgm-alt.json configuration
   npx pgm --dotenv .env.alt stat         # use .env.alt configuration
   ```

4. Inspect database

   http://localhost:8080/?pgsql=db

   ```
   Username: admin
   Password: admin
   ```

5. Stop docker
   ```
   docker-compose down
   ```

# Configuration

In case docker address is not `localhost`, it can be changed in pgm.json.
