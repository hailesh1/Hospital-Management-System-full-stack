const { Pool } = require('pg');

async function alignPatientData() {
    const pool = new Pool({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'hospital_management',
        password: '1234',
        port: 5432
    });

    try {
        console.log('--- Aligning Mock Patient Data with DB ---');

        // Check if Dawit Alemu exists
        const check = await pool.query("SELECT id FROM patients WHERE id = '3' OR (first_name = 'Dawit' AND last_name = 'Alemu')");

        if (check.rows.length === 0) {
            console.log('Inserting mock patient: Dawit Alemu [ID: 3]');
            await pool.query(
                "INSERT INTO patients (id, first_name, last_name, email, phone, gender, date_of_birth, status, registered_date) " +
                "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE)",
                ['3', 'Dawit', 'Alemu', 'patient@hospital.com', '+251000000001', 'male', '1990-05-15', 'active']
            );
            console.log('Successfully inserted mock patient.');
        } else {
            console.log('Mock patient already exists or name conflict found.');
            // Ensure ID is '3' if found by name but different ID
            if (check.rows[0].id !== '3') {
                console.log(`Found patient with different ID: ${check.rows[0].id}. Updating to '3'...`);
                await pool.query("UPDATE patients SET id = '3' WHERE id = $1", [check.rows[0].id]);
            }
        }

        console.log('Data alignment complete.');
    } catch (error) {
        console.error('Alignment error:', error);
    } finally {
        await pool.end();
    }
}

alignPatientData();
