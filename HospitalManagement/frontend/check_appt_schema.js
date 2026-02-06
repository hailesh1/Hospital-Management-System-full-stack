const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env.local' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkTable() {
  try {
    console.log("Checking appointments table structure...");
    
    // Get columns
    const resCols = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'appointments';
    `);
    console.log("Columns:", resCols.rows);

    // Get constraints (check constraints)
    const resConstraints = await pool.query(`
      SELECT conname, pg_get_constraintdef(c.oid)
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE c.conrelid = 'appointments'::regclass;
    `);
    console.log("Constraints:", resConstraints.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

checkTable();