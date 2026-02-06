const { query } = require('./lib/db');

async function dumpAppointments() {
    try {
        const res = await query('SELECT * FROM appointments ORDER BY appointment_date DESC LIMIT 10');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

dumpAppointments();
