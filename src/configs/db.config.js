const path = require("path");
const { Pool } = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config();

// Initialize PostgreSQL connection pool
const DB_URL = process.env.DB_URL || "postgres://user_name:password@localhost/db_name";

const pool = new Pool({
  connectionString: DB_URL,
  logging: true,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err);
});

// Initialize Drizzle ORM instance
const db = drizzle(pool);

module.exports = {
  db,
  pool,
};
