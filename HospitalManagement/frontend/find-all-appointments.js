const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', host: '127.0.0.1', database: 'hospital_management', password: '1234', port: 5432,
});

async function run() {
    try {
        console.log('--- FINDING ALL APPOINTMENTS TABLES ---');
        const res = await pool.query(`
            SELECT table_schema, table_name 
            FROM information_schema.tables 
            WHERE table_name = 'appointments'
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
