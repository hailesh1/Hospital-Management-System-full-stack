const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function fixAppointmentsConstraints() {
    try {
        console.log('--- FIXING APPOINTMENTS CONSTRAINTS ---');

        console.log('Dropping appointments_type_check constraint...');
        await pool.query('ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_type_check');
        console.log('Success: Appointment Type constraint removed.');

        console.log('Dropping appointments_status_check constraint...');
        await pool.query('ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check');
        console.log('Success: Appointment Status constraint removed.');

        console.log('\nAny type or status value is now accepted in the appointments table.');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

fixAppointmentsConstraints();
