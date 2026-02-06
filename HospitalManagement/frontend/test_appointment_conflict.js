const { query } = require('./lib/db');

async function testConflict() {
    try {
        // 1. Get a patient and a doctor
        const patientRes = await query('SELECT id FROM patients LIMIT 1');
        const doctorRes = await query("SELECT id FROM staff WHERE role ILIKE '%doctor%' LIMIT 1");

        if (patientRes.rows.length === 0 || doctorRes.rows.length === 0) {
            console.log('Need at least one patient and one doctor to test.');
            return;
        }

        const patientId = patientRes.rows[0].id;
        const doctorId = doctorRes.rows[0].id;
        const date = '2026-12-25';
        const time = '10:00';

        console.log(`Testing with Patient: ${patientId}, Doctor: ${doctorId}, Date: ${date}, Time: ${time}`);

        // 2. Clean up any existing test appointment
        await query("DELETE FROM appointments WHERE date = $1 AND time = $2", [date, time]);

        // 3. Create the first appointment
        console.log('Creating first appointment...');
        const res1 = await fetch('http://localhost:3000/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patient_id: patientId,
                doctor_id: doctorId,
                date: date,
                time: time,
                type: 'CONSULTATION',
                notes: 'Test 1'
            })
        });
        console.log('First Appt Status:', res1.status);
        if (res1.status !== 201) {
            const err = await res1.json();
            console.error('Failed to create first appt:', err);
            return;
        }

        // 4. Try to create the second appointment at the same time
        console.log('Attempting to create second appointment at the same slot...');
        const res2 = await fetch('http://localhost:3000/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patient_id: patientId,
                doctor_id: doctorId,
                date: date,
                time: time,
                type: 'CONSULTATION',
                notes: 'Test 2'
            })
        });
        console.log('Second Appt Status:', res2.status);
        const data2 = await res2.json();
        console.log('Second Appt Response:', data2);

        if (res2.status === 409) {
            console.log('SUCCESS: Conflict detected correctly.');
        } else {
            console.log('FAILURE: Conflict NOT detected.');
        }

        // Cleanup
        await query("DELETE FROM appointments WHERE date = $1 AND time = $2", [date, time]);

    } catch (err) {
        console.error('Test error:', err);
    }
}

testConflict();
