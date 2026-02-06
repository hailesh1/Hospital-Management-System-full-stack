const { Pool } = require('pg');

// Use defaults from lib/db.js since .env.local might be missing or invalid
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'hospital_management',
  password: '1234',
  port: 5432,
});

async function listColumns() {
  try {
    console.log("Listing columns for 'appointments' table...");
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'appointments'
    `);
    console.log(res.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

listColumns();