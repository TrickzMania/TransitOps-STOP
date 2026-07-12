/**
 * init-db.js
 * Run once to create tables and seed data.
 * Usage: node init-db.js
 * On Render: add this to the Build Command after npm install if you want auto-init.
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
      }
);

async function run() {
  const schemaPath = path.join(__dirname, "..", "database", "schema.sql");
  const seedPath   = path.join(__dirname, "..", "database", "seed.sql");

  console.log("📦 Running schema...");
  const schema = fs.readFileSync(schemaPath, "utf8");
  await pool.query(schema);
  console.log("✅ Schema applied.");

  console.log("🌱 Running seed data...");
  const seed = fs.readFileSync(seedPath, "utf8");
  await pool.query(seed);
  console.log("✅ Seed data inserted.");

  await pool.end();
  console.log("🚀 Database ready!");
}

run().catch((err) => {
  console.error("❌ DB init failed:", err.message);
  process.exit(1);
});
