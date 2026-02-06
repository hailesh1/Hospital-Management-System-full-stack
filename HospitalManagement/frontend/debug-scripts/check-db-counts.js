const { query } = require('./lib/db');

async function checkCounts() {
    try {
        const patients = await query('SELECT COUNT(*) FROM patients');
        console.log('Patients:', patients.rows[0].count);

        const staff = await query('SELECT COUNT(*) FROM staff');
        console.log('Staff:', staff.rows[0].count);

        const appointments = await query('SELECT COUNT(*) FROM appointments');
        console.log('All Appointments:', appointments.rows[0].count);

        const appointmentsToday = await query('SELECT COUNT(*) FROM appointments WHERE DATE(appointment_date) = CURRENT_DATE');
        console.log('Appointments Today:', appointmentsToday.rows[0].count);

        const medicalRecords = await query('SELECT COUNT(*) FROM medical_records');
        console.log('Medical Records:', medicalRecords.rows[0].count);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

checkCounts();
