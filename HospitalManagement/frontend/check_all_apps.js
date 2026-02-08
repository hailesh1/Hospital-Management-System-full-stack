const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function checkAllApps() {
    try {
        console.log('--- ALL APPOINTMENTS ---');
        const res = await pool.query(`
      SELECT a.id, a.patient_id, a.patient_name as app_pname, 
             p.id as pat_id, CONCAT(p.first_name, ' ', p.last_name) as current_pat_name, p.email
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
    `);
        console.table(res.rows);

        console.log('\n--- ALL PATIENTS ---');
        const pats = await pool.query("SELECT id, email, first_name, last_name FROM patients");
        console.table(pats.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkAllApps();
