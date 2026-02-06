const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function fixSchema() {
  try {
    console.log('Adding missing columns to medical_records...');
    await pool.query(`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS title VARCHAR(255)`);
    await pool.query(`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS type VARCHAR(50)`);
    await pool.query(`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS file_name VARCHAR(255)`);
    await pool.query(`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS notes TEXT`);
    
    console.log('Relaxing constraints on legacy columns...');
    await pool.query(`ALTER TABLE medical_records ALTER COLUMN diagnosis DROP NOT NULL`);
    await pool.query(`ALTER TABLE medical_records ALTER COLUMN treatment DROP NOT NULL`);
    
    console.log('Schema update complete.');
  } catch (error) {
    console.error('Schema update failed:', error.message);
  } finally {
    pool.end();
  }
}

fixSchema();
