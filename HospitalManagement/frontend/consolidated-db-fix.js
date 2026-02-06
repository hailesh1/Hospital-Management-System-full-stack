const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function runConsolidatedFix() {
    try {
        console.log('--- STARTING CONSOLIDATED DB FIX ---');

        // 1. Fix Appointment Constraints
        console.log('\n--- 1. Fixing Appointments Table ---');
        const appointmentsConstraints = await pool.query(`
            SELECT conname 
            FROM pg_constraint c
            JOIN pg_class r ON r.oid = c.conrelid
            WHERE r.relname = 'appointments' AND c.contype = 'c'
        `);

        for (const row of appointmentsConstraints.rows) {
            console.log(`Dropping constraint: ${row.conname}`);
            await pool.query(`ALTER TABLE appointments DROP CONSTRAINT IF EXISTS "${row.conname}" CASCADE`);
        }
        console.log('Success: All restrictive check constraints dropped from appointments.');

        // 2. Fix Medical Records Schema
        console.log('\n--- 2. Fixing Medical Records Table ---');

        // Ensure necessary columns exist
        const columns = [
            { name: 'title', type: 'VARCHAR(255)' },
            { name: 'type', type: 'VARCHAR(50)' },
            { name: 'file_name', type: 'VARCHAR(255)' },
            { name: 'notes', type: 'TEXT' },
            { name: 'date', type: 'TIMESTAMP DEFAULT NOW()' },
            { name: 'doctor_id', type: 'VARCHAR(100)' },
            { name: 'doctor_name', type: 'VARCHAR(255)' }
        ];

        for (const col of columns) {
            console.log(`Ensuring column exists: ${col.name}`);
            await pool.query(`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
        }

        // Fix ID generation if it's missing a default
        console.log('Updating medical_records ID default...');
        await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await pool.query('ALTER TABLE medical_records ALTER COLUMN id SET DEFAULT uuid_generate_v4()');

        // Drop any check constraints on medical_records too
        const recordsConstraints = await pool.query(`
            SELECT conname 
            FROM pg_constraint c
            JOIN pg_class r ON r.oid = c.conrelid
            WHERE r.relname = 'medical_records' AND c.contype = 'c'
        `);

        for (const row of recordsConstraints.rows) {
            console.log(`Dropping record constraint: ${row.conname}`);
            await pool.query(`ALTER TABLE medical_records DROP CONSTRAINT IF EXISTS "${row.conname}" CASCADE`);
        }

        console.log('Success: Medical records schema updated and constraints cleared.');

        console.log('\n--- ALL FIXES COMPLETE ---');
    } catch (err) {
        console.error('Migration Error:', err.message);
    } finally {
        await pool.end();
    }
}

runConsolidatedFix();
