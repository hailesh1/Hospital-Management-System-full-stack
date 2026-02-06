const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function fix() {
    console.log('Dropping lab_tests_status_check constraint...');
    try {
        await pool.query("ALTER TABLE lab_tests DROP CONSTRAINT IF EXISTS lab_tests_status_check");
        console.log('Constraint dropped successfully.');
    } catch (e) {
        console.error('Error dropping constraint:', e);
    } finally {
        await pool.end();
    }
}

fix();
