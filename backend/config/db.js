const { Pool } = require("pg");
require("dotenv").config();

// Cloud providers (Render, Neon, Railway) supply a single DATABASE_URL.
// Fall back to individual params for local dev.
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // required for most cloud Postgres
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
      }
);

pool
  .connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.error("❌ Database Connection Error:", err.message));

module.exports = pool;
