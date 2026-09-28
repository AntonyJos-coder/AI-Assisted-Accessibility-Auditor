const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function initDb() {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    await pool.query(schema);

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Failed to init DB:", error.message);
  } finally {
    await pool.end();
  }
}

initDb();