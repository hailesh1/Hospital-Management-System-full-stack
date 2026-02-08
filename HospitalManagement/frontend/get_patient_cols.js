const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function getCols() {
    try {
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'patients'");
        const cols = res.rows.map(r => r.column_name);
        console.log(cols.join(', '));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

getCols();
