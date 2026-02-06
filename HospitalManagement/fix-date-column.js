
const { query } = require('./frontend/lib/db');

async function fixDateColumn() {
  try {
    console.log('Making "date" column nullable in medical_records...');
    await query(`ALTER TABLE medical_records ALTER COLUMN date DROP NOT NULL`);
    
    // Optional: Copy created_at to date if date is null, or vice versa? 
    // For now, just allowing NULL is enough to unblock the INSERT.
    
    console.log('Schema update complete.');
  } catch (error) {
    console.error('Schema update failed:', error.message);
  }
}

fixDateColumn();
