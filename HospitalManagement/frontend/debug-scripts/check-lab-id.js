const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function check() {
    console.log('Checking lab_tests ID column...');
    try {
        const res = await pool.query(`
            SELECT column_name, is_nullable, column_default, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'lab_tests' AND column_name = 'id'
        `);
        console.table(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

check();
