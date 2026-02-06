const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
});

async function runFix() {
    try {
        console.log('--- STARTING DATABASE SCHEAM FIX ---');

        // 1. Add created_by to patients
        console.log('Ensuring created_by exists in patients table...');
        await pool.query(`
            ALTER TABLE patients 
            ADD COLUMN IF NOT EXISTS created_by UUID;
        `);
        console.log('Success: created_by column ensured.');

        // 2. Add created_by to other tables if needed by the frontend API
        // Checking other tables that might need it
        const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices'];
        for (const table of tables) {
            console.log(`Ensuring created_by exists in ${table} table...`);
            await pool.query(`
                ALTER TABLE ${table} 
                ADD COLUMN IF NOT EXISTS created_by UUID;
            `);
        }

        // 3. Ensure a default department exists to prevent staff creation errors
        console.log('Seeding default department...');
        await pool.query(`
            INSERT INTO departments (name, description)
            VALUES ('General Medicine', 'General medical department')
            ON CONFLICT (name) DO NOTHING;
        `);

        // Get the ID of the department we just ensured exists
        const deptRes = await pool.query("SELECT id FROM departments WHERE name = 'General Medicine'");
        const defaultDeptId = deptRes.rows[0].id;
        console.log(`Success: Default department ensured with ID: ${defaultDeptId}`);

        // 4. Ensure uuid-ossp extension is enabled
        console.log('Ensuring uuid-ossp extension...');
        await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        console.log('--- DATABASE FIX COMPLETE ---');
    } catch (err) {
        console.error('Migration Error:', err.message);
    } finally {
        await pool.end();
    }
}

runFix();
