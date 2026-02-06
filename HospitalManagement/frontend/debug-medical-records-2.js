const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function checkColumns() {
  try {
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'medical_records'
    `);
    console.log('Columns in medical_records:', res.rows.map(r => r.column_name));
    
    try {
        await pool.query("SELECT type FROM medical_records LIMIT 1");
        console.log("Column 'type' exists and is queryable.");
    } catch (e) {
        console.log("Column 'type' query failed:", e.message);
    }

  } catch (err) {
    console.error('Error checking columns:', err);
  } finally {
    pool.end();
  }
}

checkColumns();
