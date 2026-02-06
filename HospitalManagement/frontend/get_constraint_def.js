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
        console.log('--- GETTING CONSTRAINT DEFINITION ---');
        const res = await pool.query(`
            SELECT conname, pg_get_constraintdef(c.oid) as definition
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            JOIN pg_class r ON r.oid = c.conrelid
            WHERE conname = 'patients_status_check';
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
