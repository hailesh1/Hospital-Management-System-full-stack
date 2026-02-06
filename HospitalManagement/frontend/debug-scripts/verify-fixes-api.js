const fetch = require('node-fetch');

async function verify() {
    const baseUrl = 'http://localhost:3001'; // Port from .env

    try {
        console.log('--- Verifying Appointments API ---');
        const apptRes = await fetch(`${baseUrl}/api/appointments`);
        if (apptRes.ok) {
            const appts = await apptRes.json();
            console.log(`Fetched ${appts.length} appointments.`);
            if (appts.length > 0) {
                console.log('First appointment patient name:', appts[0].patient_name);
            }
        } else {
            console.error('Failed to fetch appointments:', apptRes.status);
        }

        console.log('\n--- Verifying Dashboard Appointments API ---');
        const dashRes = await fetch(`${baseUrl}/api/dashboard/appointments`);
        if (dashRes.ok) {
            const dashAppts = await dashRes.json();
            console.log(`Fetched ${dashAppts.length} dashboard appointments.`);
            if (dashAppts.length > 0) {
                console.log('First dashboard patient name:', dashAppts[0].patient_name);
            }
        } else {
            console.error('Failed to fetch dashboard appointments:', dashRes.status);
        }

        console.log('\n--- Verifying Medical Records API ---');
        const recRes = await fetch(`${baseUrl}/api/medical-records`);
        if (recRes.ok) {
            const records = await recRes.json();
            console.log(`Fetched ${records.length} medical records.`);
            if (records.length > 0) {
                console.log('First record patient/patient_name:', records[0].patient, '/', records[0].patient_name);
            }
        } else {
            console.error('Failed to fetch medical records:', recRes.status);
        }

    } catch (err) {
        console.error('Verification error:', err.message);
    }
}

verify();
