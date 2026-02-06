const { Pool } = require('pg');

async function alignData() {
    const pool = new Pool({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'hospital_management',
        password: '1234',
        port: 5432
    });

    try {
        console.log('--- Aligning Mock Data with DB ---');

        // Check if Kebede Tadesse exists
        const check = await pool.query("SELECT id FROM staff WHERE id = '2' OR (first_name = 'Kebede' AND last_name = 'Tadesse')");

        if (check.rows.length === 0) {
            console.log('Inserting mock doctor: Kebede Tadesse [ID: 2]');
            await pool.query(
                "INSERT INTO staff (id, first_name, last_name, email, phone, role, specialization, status, join_date) " +
                "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE)",
                ['2', 'Kebede', 'Tadesse', 'doctor@hospital.com', '+251000000000', 'DOCTOR', 'General Medicine', 'ACTIVE']
            );
            console.log('Successfully inserted mock doctor.');
        } else {
            console.log('Mock doctor already exists or name conflict found.');
            // Ensure ID is '2' if found by name but different ID
            if (check.rows[0].id !== '2') {
                console.log(`Found doctor with different ID: ${check.rows[0].id}. Updating to '2'...`);
                await pool.query("UPDATE staff SET id = '2' WHERE id = $1", [check.rows[0].id]);
            }
        }

        console.log('Data alignment complete.');
    } catch (error) {
        console.error('Alignment error:', error);
    } finally {
        await pool.end();
    }
}

alignData();
