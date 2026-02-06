const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
    connectionTimeoutMillis: 5000
});

async function run() {
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables:', JSON.stringify(res.rows.map(r => r.table_name)));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}
run();
