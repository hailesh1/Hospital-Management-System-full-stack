const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function check() {
    try {
        const res = await pool.query('SELECT type, title, COUNT(*) FROM medical_records GROUP BY type, title');
        console.log('Medical Records:', JSON.stringify(res.rows, null, 2));

        const labs = await pool.query("SELECT * FROM medical_records WHERE type ILIKE '%lab%' OR title ILIKE '%lab%'");
        console.log('Lab Records:', JSON.stringify(labs.rows, null, 2));

        await pool.end();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
