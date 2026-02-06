const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
    connectionTimeoutMillis: 5000,
});

async function run() {
    try {
        console.log('Connecting...');
        const client = await pool.connect();
        console.log('Connected. Querying...');
        const res = await client.query("SELECT pg_get_constraintdef(oid) as def FROM pg_constraint WHERE conname = 'lab_tests_test_type_check'");
        if (res.rows.length) {
            console.log('CONSTRAINT DEF:', res.rows[0].def);
        } else {
            console.log('CONSTRAINT NOT FOUND');
        }
        client.release();
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await pool.end();
    }
}
run();
