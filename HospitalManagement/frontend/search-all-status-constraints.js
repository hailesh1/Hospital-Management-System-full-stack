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
        console.log('--- SEARCHING ALL CONSTRAINTS ---');
        const res = await pool.query(`
            SELECT nspname as schema, relname as table, conname as constraint
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            JOIN pg_class r ON r.oid = c.conrelid
            WHERE conname LIKE '%status%';
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
