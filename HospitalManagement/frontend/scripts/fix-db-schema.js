const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || '1234',
    port: parseInt(process.env.DB_PORT || '5432'),
    connectionTimeoutMillis: 5000,
    query_timeout: 10000, // 10 seconds per query
});

async function runFix() {
    try {
        console.log('--- STARTING COMPREHENSIVE DATABASE SCHEMA FIX ---');

        console.log('Ensuring uuid-ossp extension...');
        await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        // Fix Patients table
        console.log('Fixing patients table...');
        await pool.query(`
      ALTER TABLE patients 
      ADD COLUMN IF NOT EXISTS created_by UUID;
    `);

        // Fix Appointments table ID and doctor_id
        console.log('Step 1: Fixing appointments table columns...');

        // Drop foreign key constraints that might block the change
        try {
            console.log('  Dropping prescriptions_appointment_id_fkey...');
            await pool.query('ALTER TABLE prescriptions DROP CONSTRAINT IF EXISTS prescriptions_appointment_id_fkey');
            console.log('  Dropping medical_records_appointment_id_fkey...');
            await pool.query('ALTER TABLE medical_records DROP CONSTRAINT IF EXISTS medical_records_appointment_id_fkey');
            console.log('  Dropping appointments_doctor_id_fkey...');
            await pool.query('ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_doctor_id_fkey');
        } catch (e) {
            console.log('  Note: Some constraints could not be dropped:', e.message);
        }

        console.log('Step 2: Altering appointments ID column types...');
        await pool.query(`
      ALTER TABLE appointments 
      ALTER COLUMN id TYPE VARCHAR(255),
      ALTER COLUMN id DROP DEFAULT;
    `);
        console.log('  Appointments ID column altered.');

        console.log('Step 2b: Altering appointments doctor_id column types...');
        await pool.query(`
      ALTER TABLE appointments 
      ALTER COLUMN doctor_id TYPE UUID USING doctor_id::text::uuid;
    `);
        console.log('  Appointments doctor_id column altered.');

        console.log('Step 3: Adding missing columns to appointments...');
        // The API uses a string for ID, but schema says SERIAL. 
        // We'll change it to VARCHAR if it's currently an integer-based serial, 
        // but in many cases it's better to just add the missing columns first.
        await pool.query(`
      ALTER TABLE appointments 
      ADD COLUMN IF NOT EXISTS patient_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS type VARCHAR(100),
      ADD COLUMN IF NOT EXISTS date DATE,
      ADD COLUMN IF NOT EXISTS time VARCHAR(20),
      ADD COLUMN IF NOT EXISTS created_by UUID;
    `);
        console.log('  Missing columns added to appointments.');

        // Ensure status enum/check for appointments is flexible
        try {
            console.log('Step 4: Dropping appointments_status_check...');
            await pool.query(`ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check`);
        } catch (e) {
            console.log('  Note: Could not drop constraint:', e.message);
        }

        // Fix Staff table status
        console.log('Step 5: Adding created_by to staff...');
        await pool.query(`
      ALTER TABLE staff 
      ADD COLUMN IF NOT EXISTS created_by UUID;
    `);
        console.log('  Staff table fixed.');

        // Fix other tables for created_by
        const tables = ['medical_records', 'lab_tests', 'prescriptions', 'invoices'];
        for (const table of tables) {
            console.log(`Ensuring created_by exists in ${table} table...`);
            await pool.query(`
        ALTER TABLE ${table} 
        ADD COLUMN IF NOT EXISTS created_by UUID;
      `);
        }

        // Fix Medical Records missing 'type' column
        console.log('Fixing Medical Records schema...');
        await pool.query(`
        ALTER TABLE medical_records 
        ADD COLUMN IF NOT EXISTS type VARCHAR(100);
      `);

        console.log('--- DATABASE FIX COMPLETE ---');
    } catch (err) {
        console.error('Migration Error:', err.message);
    } finally {
        await pool.end();
    }
}

runFix();
