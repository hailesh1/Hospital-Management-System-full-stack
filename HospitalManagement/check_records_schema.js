const { query } = require('./frontend/lib/db');

async function checkMedicalRecordsSchema() {
    try {
        const res = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'medical_records'
      ORDER BY ordinal_position;
    `);
        console.log('Columns in medical_records table:');
        console.table(res.rows);
    } catch (error) {
        console.error('Error checking schema:', error.message);
    }
}

checkMedicalRecordsSchema();
