const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function fix() {
    console.log('Fixing lab_tests ID column...');
    try {
        // Ensure UUID extension is available
        await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        // Set default value for ID
        await pool.query('ALTER TABLE lab_tests ALTER COLUMN id SET DEFAULT uuid_generate_v4();');
        console.log('Success: lab_tests.id default set to uuid_generate_v4()');

        // Also check prescriptions just in case
        await pool.query('ALTER TABLE prescriptions ALTER COLUMN id SET DEFAULT uuid_generate_v4();');
        console.log('Success: prescriptions.id default set to uuid_generate_v4()');

    } catch (e) {
        console.error('Error fixing schemas:', e);
    } finally {
        await pool.end();
    }
}

fix();
