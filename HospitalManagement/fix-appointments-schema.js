const { query } = require('./frontend/lib/db');

async function fixAppointmentsSchema() {
    try {
        console.log('Adding missing columns to appointments...');
        await query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reason TEXT`);
        await query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS diagnosis TEXT`);
        await query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS prescription TEXT`);
        await query(`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS appointment_date TIMESTAMP`);

        console.log('Schema update complete.');
    } catch (error) {
        console.error('Schema update failed:', error.message);
    }
}

fixAppointmentsSchema();
