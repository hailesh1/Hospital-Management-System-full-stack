const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', host: '127.0.0.1', database: 'hospital_management', password: '1234', port: 5432,
});

async function run() {
    try {
        console.log('--- UPDATING APPOINTMENT STATUS CONSTRAINT ---');

        // 1. Drop it forcefully
        await pool.query('ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check CASCADE');
        console.log('Dropped existing constraint (if any).');

        // 2. Add it back with both cases
        await pool.query(`
            ALTER TABLE appointments 
            ADD CONSTRAINT appointments_status_check 
            CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show', 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'CONFIRMED', 'IN_PROGRESS', 'confirmed', 'in_progress'))
        `);
        console.log('Added new case-insensitive constraint.');

        // 3. Do the same for type
        await pool.query('ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_type_check CASCADE');
        await pool.query(`
            ALTER TABLE appointments 
            ADD CONSTRAINT appointments_type_check 
            CHECK (type IN ('CHECKUP', 'FOLLOW_UP', 'EMERGENCY', 'CONSULTATION', 'checkup', 'follow_up', 'emergency', 'consultation'))
        `);
        console.log('Added new case-insensitive type constraint.');

        console.log('--- SUCCESS ---');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
