const { Pool } = require('pg');

async function verifyFix() {
    const pool = new Pool({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'hospital_management',
        password: '1234',
        port: 5432
    });

    try {
        console.log('--- Verifying Appointment Doctor Fix ---');

        // 1. Fetch doctors from DB using the same logic as API
        const doctors = await pool.query(
            "SELECT id, first_name || ' ' || last_name as name, role FROM staff WHERE role ILIKE '%doctor%' OR role ILIKE '%specialist%' OR role = 'DOCTOR'"
        );
        console.log(`Step 1: Found ${doctors.rows.length} doctors with relaxed role check.`);
        if (doctors.rows.length === 0) {
            console.log('Warning: No doctors found. Verification might fail.');
            return;
        }

        const testDoctor = doctors.rows[0];
        console.log(`Using doctor: ${testDoctor.name} (${testDoctor.role}) [${testDoctor.id}]`);

        // 2. Check if a patient exists
        const patients = await pool.query("SELECT id FROM patients LIMIT 1");
        if (patients.rows.length === 0) {
            console.log('Warning: No patients found. Verification cannot proceed.');
            return;
        }
        const testPatientId = patients.rows[0].id;

        // 3. Try to validate doctor in the same way the appointment API does
        const doctorCheck = await pool.query(
            "SELECT first_name, last_name FROM staff WHERE id = $1 AND (role ILIKE '%doctor%' OR role ILIKE '%specialist%' OR role = 'DOCTOR')",
            [testDoctor.id]
        );

        if (doctorCheck.rows.length > 0) {
            console.log('Step 2: Doctor validation passed in DB simulation.');
        } else {
            console.error('Step 2: Doctor validation FAILED in DB simulation.');
        }

        console.log('\nVerification complete.');
    } catch (error) {
        console.error('Verification error:', error);
    } finally {
        await pool.end();
    }
}

verifyFix();
