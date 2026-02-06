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
        console.log('--- FINDING ALL CONSTRAINTS ON APPOINTMENTS TABLES ---');
        const res = await pool.query(`
            SELECT 
                n.nspname as schema,
                r.relname as table,
                c.conname as constraint,
                pg_get_constraintdef(c.oid) as definition
            FROM pg_constraint c
            JOIN pg_class r ON r.oid = c.conrelid
            JOIN pg_namespace n ON n.oid = r.relnamespace
            WHERE r.relname = 'appointments'
              AND c.contype = 'c'
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
