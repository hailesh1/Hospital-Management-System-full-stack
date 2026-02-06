const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: 'yourpassword',
    port: 5432,
});

async function fixGenderConstraint() {
    try {
        console.log('Dropping patients_gender_check constraint...');
        await pool.query('ALTER TABLE patients DROP CONSTRAINT IF EXISTS patients_gender_check');
        console.log('Success: Gender constraint removed. Any gender value is now accepted.');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

fixGenderConstraint();
