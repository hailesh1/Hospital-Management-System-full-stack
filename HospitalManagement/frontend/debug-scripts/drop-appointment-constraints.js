const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function run() {
    try {
        console.log('--- STARTING DEFINITIVE CONSTRAINT REMOVAL ---');

        // Find all check constraints on the appointments table
        const res = await pool.query(`
            SELECT conname 
            FROM pg_constraint 
            WHERE conrelid = 'appointments'::regclass AND contype = 'c'
        `);

        console.log(`Found ${res.rows.length} check constraints.`);

        for (const row of res.rows) {
            console.log(`Dropping constraint: ${row.conname}...`);
            await pool.query(`ALTER TABLE appointments DROP CONSTRAINT IF EXISTS "${row.conname}" CASCADE`);
        }

        console.log('--- ALL CHECK CONSTRAINTS DROPPED SUCCESSFULLY ---');
    } catch (err) {
        console.error('Error during constraint removal:', err.message);
    } finally {
        await pool.end();
    }
}

run();
