const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function checkDateColumn() {
  try {
    const res = await pool.query(`
      SELECT column_name, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'medical_records' 
      AND column_name IN ('date', 'created_at')
    `);
    
    console.log(res.rows);

  } catch (err) {
    console.error('Error checking columns:', err);
  } finally {
    pool.end();
  }
}

checkDateColumn();
