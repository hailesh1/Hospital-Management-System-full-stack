const { Pool } = require('pg');
const pool = new Pool({ user: 'postgres', host: '127.0.0.1', database: 'hospital_management', password: '1234', port: 5432 });
async function run() {
    try {
        const res = await pool.query("SELECT * FROM patients WHERE id = '3'");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}
run();
