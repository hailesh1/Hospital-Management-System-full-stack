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
        console.log('--- STARTING CLEAN DROP OF CONSTRAINTS ---');

        // Find all check constraints using a robust query
        const query = `
            SELECT conname, pg_get_constraintdef(c.oid) as definition
            FROM pg_constraint c
            JOIN pg_class r ON r.oid = c.conrelid
            JOIN pg_namespace n ON n.oid = r.relnamespace
            WHERE r.relname = 'appointments'
              AND n.nspname = 'public'
              AND c.contype = 'c';
        `;

        const res = await pool.query(query);
        console.log(`Found ${res.rows.length} check constraints.`);

        for (const row of res.rows) {
            console.log(`Processing: ${row.conname} -> ${row.definition}`);
            console.log(`Executing: ALTER TABLE public.appointments DROP CONSTRAINT "${row.conname}" CASCADE`);
            await pool.query(`ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS "${row.conname}" CASCADE`);
        }

        console.log('--- DROP COMPLETE ---');

        // Final verify
        const verifyRes = await pool.query(query);
        console.log(`Remaining check constraints: ${verifyRes.rows.length}`);

    } catch (err) {
        console.error('Migration Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
