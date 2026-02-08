const fetch = require('node-fetch');

async function verifyFallbacks() {
    const baseUrl = 'http://localhost:3000'; // Assuming the app runs on 3000
    const fakeId = 'non-existent-id-' + Math.random();

    console.log('--- VERIFYING FALLBACK REMOVAL ---');

    const endpoints = [
        `/api/patient/stats?patientId=${fakeId}`,
        `/api/invoices?patientId=${fakeId}`,
        `/api/appointments?patientId=${fakeId}`,
        `/api/medical-records?patientId=${fakeId}`
    ];

    for (const ep of endpoints) {
        try {
            console.log(`\nTesting ${ep}...`);
            const res = await fetch(baseUrl + ep);
            if (res.ok) {
                const data = await res.json();
                console.log('Result:', Array.isArray(data) ? `Empty Array (count: ${data.length})` : JSON.stringify(data));

                if (Array.isArray(data) && data.length > 0) {
                    console.error('❌ FAIL: Fallback still active! Returned data for non-existent ID.');
                } else if (!Array.isArray(data) && data.upcomingAppointments !== 0) {
                    console.error('❌ FAIL: Fallback still active in stats! Returned non-zero counts.');
                } else {
                    console.log('✅ PASS: No data leaked.');
                }
            } else {
                console.log(`Response Status: ${res.status}`);
            }
        } catch (err) {
            console.error(`Failed to fetch ${ep}:`, err.message);
        }
    }
}

verifyFallbacks();
