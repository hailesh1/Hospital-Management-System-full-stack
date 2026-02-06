const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function fixPatientNameConstraint() {
  try {
    console.log('Relaxing NOT NULL constraint on patient_name...');
    await pool.query(`ALTER TABLE medical_records ALTER COLUMN patient_name DROP NOT NULL`);
    console.log('Constraint relaxed.');

  } catch (error) {
    console.error('Schema update failed:', error.message);
  } finally {
    pool.end();
  }
}

fixPatientNameConstraint();
