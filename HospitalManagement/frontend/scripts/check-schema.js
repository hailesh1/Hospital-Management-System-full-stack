console.log('DIAGNOSTIC SCRIPT STARTED');
const { Pool } = require('pg');

console.log('Creating Pool...');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
    connectionTimeoutMillis: 5000,
});

async function checkSchema() {
    try {
        console.log('--- SCHEMA DIAGNOSTIC ---');
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'appointments'
    `);
        console.log('Appointments Columns:');
        res.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));

        const patientsRes = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'patients'
    `);
        console.log('Patients Columns:');
        patientsRes.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));

        const staffRes = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'staff'
    `);
        console.log('Staff Columns:');
        staffRes.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));

    } catch (err) {
        console.error('Diagnostic Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkSchema();
