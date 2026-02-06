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
        // 1. Get a doctor ID
        const docRes = await pool.query("SELECT id FROM staff WHERE role = 'DOCTOR' LIMIT 1");
        if (docRes.rows.length === 0) {
            console.log('No doctors found');
            return;
        }
        const doctorId = docRes.rows[0].id;
        console.log('Doctor ID:', doctorId);

        // 2. Query appointments for today
        const today = new Date().toISOString().split('T')[0];
        console.log('Querying for date:', today);

        const res = await pool.query(`
          SELECT a.*, 
                 CONCAT(p.first_name, ' ', p.last_name) as patient_name, 
                 CONCAT(d.first_name, ' ', d.last_name) as doctor_name
          FROM appointments a
          LEFT JOIN patients p ON a.patient_id = p.id
          LEFT JOIN staff d ON a.doctor_id = d.id
          WHERE a.doctor_id = $1 AND a.date = $2
          ORDER BY a.date DESC, a.time DESC
        `, [doctorId, today]);

        console.log('Appointments found:', res.rows.length);
        console.table(res.rows);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
