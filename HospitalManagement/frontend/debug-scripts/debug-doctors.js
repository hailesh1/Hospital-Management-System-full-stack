const { Pool } = require('pg');
const fs = require('fs');

async function debugDoctors() {
    const pool = new Pool({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'hospital_management',
        password: '1234',
        port: 5432
    });

    try {
        const doctors = await pool.query("SELECT id, first_name, last_name, role FROM staff WHERE role ILIKE 'Doctor' OR role ILIKE 'Medical Doctor'");
        const staffAll = await pool.query("SELECT id, first_name, last_name, role FROM staff LIMIT 5");

        const output = {
            doctors: doctors.rows,
            sample_staff: staffAll.rows
        };

        fs.writeFileSync('debug-doctors-output.json', JSON.stringify(output, null, 2));
        console.log('Output written to debug-doctors-output.json');
    } catch (error) {
        fs.writeFileSync('debug-doctors-error.txt', error.stack);
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

debugDoctors();
