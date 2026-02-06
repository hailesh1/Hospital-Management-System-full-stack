const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function dropConstraint() {
    try {
        console.log('Dropping constraint lab_tests_test_type_check...');
        await pool.query('ALTER TABLE lab_tests DROP CONSTRAINT IF EXISTS lab_tests_test_type_check');
        console.log('Constraint dropped successfully.');
    } catch (err) {
        console.error('Error dropping constraint:', err);
    } finally {
        await pool.end();
    }
}

dropConstraint();
