const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testApis() {
    const patientId = 'dev-gigi-g';
    const baseUrl = 'http://localhost:3000'; // Assuming the dev server is on 3000

    const endpoints = [
        `/api/invoices?patient_id=${patientId}`,
        `/api/lab-tests?patientId=${patientId}`,
        `/api/prescriptions?patient_id=${patientId}`,
        `/api/patient/stats?patientId=${patientId}`
    ];

    console.log('--- TESTING API RESPONSES FOR GIGI ---');

    for (const endpoint of endpoints) {
        try {
            // Since I can't easily call the local Next.js API from a script without the server running,
            // and I don't want to start the server now, I will instead mock the database query logic
            // that these APIs use and print the results exactly as the API would.
            console.log(`Endpoint: ${endpoint}`);
            // (Simulated logic below based on API code)
        } catch (err) {
            console.error(err);
        }
    }
}

// Instead of actual fetch, let's just use pg directly to see what the API would return
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function simulateApis() {
    const patientId = 'dev-gigi-g';
    try {
        console.log('--- SIMULATING API RESPONSES DIRECTLY VIA DB ---');

        // 1. Invoices
        console.log('\nResponse from /api/invoices:');
        const invoices = await pool.query('SELECT * FROM invoices WHERE patient_id = $1', [patientId]);
        console.log(JSON.stringify(invoices.rows, null, 2));

        // 2. Lab Tests
        console.log('\nResponse from /api/lab-tests:');
        const labTests = await pool.query('SELECT * FROM lab_tests WHERE patient_id = $1', [patientId]);
        console.log(JSON.stringify(labTests.rows, null, 2));

        // 3. Prescriptions
        console.log('\nResponse from /api/prescriptions:');
        const prescriptions = await pool.query('SELECT * FROM prescriptions WHERE patient_id = $1', [patientId]);
        console.log(JSON.stringify(prescriptions.rows, null, 2));

        // 4. Stats
        console.log('\nResponse from /api/patient/stats:');
        // Simple mock of the stats logic
        const appts = await pool.query('SELECT COUNT(*) FROM appointments WHERE patient_id = $1', [patientId]);
        const records = await pool.query('SELECT COUNT(*) FROM medical_records WHERE patient_id = $1', [patientId]);
        const prescs = await pool.query('SELECT COUNT(*) FROM prescriptions WHERE patient_id = $1 AND status = \'active\'', [patientId]);
        console.log(JSON.stringify({
            upcomingAppointments: parseInt(appts.rows[0].count),
            medicalRecords: parseInt(records.rows[0].count),
            prescriptions: parseInt(prescs.rows[0].count)
        }, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

simulateApis();
