
const { query } = require('./frontend/lib/db');

async function fixSchema() {
  try {
    console.log('Adding missing columns to medical_records...');
    await query(`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS title VARCHAR(255)`);
    await query(`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS type VARCHAR(50)`);
    await query(`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS file_name VARCHAR(255)`);
    await query(`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS notes TEXT`);

    console.log('Relaxing constraints on doctor and patient identifiers...');
    await query(`ALTER TABLE medical_records ALTER COLUMN doctor_id DROP NOT NULL`);
    await query(`ALTER TABLE medical_records ALTER COLUMN doctor_name DROP NOT NULL`);
    await query(`ALTER TABLE medical_records ALTER COLUMN patient_name DROP NOT NULL`);

    console.log('Relaxing constraints on legacy columns...');
    await query(`ALTER TABLE medical_records ALTER COLUMN diagnosis DROP NOT NULL`);
    await query(`ALTER TABLE medical_records ALTER COLUMN treatment DROP NOT NULL`);

    console.log('Schema update complete.');
  } catch (error) {
    console.error('Schema update failed:', error.message);
  }
}

fixSchema();
