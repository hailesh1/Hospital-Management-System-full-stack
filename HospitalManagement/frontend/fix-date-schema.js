const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function fixDateSchema() {
  try {
    console.log('Setting default for date column...');
    await pool.query(`ALTER TABLE medical_records ALTER COLUMN date SET DEFAULT CURRENT_DATE`);
    console.log('Set default for date.');
    
    // Also set default for created_at if it exists
    await pool.query(`ALTER TABLE medical_records ALTER COLUMN created_at SET DEFAULT NOW()`);
    console.log('Set default for created_at.');

  } catch (error) {
    console.error('Schema update failed:', error.message);
  } finally {
    pool.end();
  }
}

fixDateSchema();
