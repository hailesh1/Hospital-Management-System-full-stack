const { query } = require('./lib/db');

async function debugData() {
    try {
        const appointments = await query('SELECT appointment_date, status FROM appointments LIMIT 5');
        console.log('Appointments:', JSON.stringify(appointments.rows, null, 2));

        const roles = await query('SELECT role, count(*) FROM staff GROUP BY role');
        console.log('Staff Role Counts:', JSON.stringify(roles.rows, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

debugData();
