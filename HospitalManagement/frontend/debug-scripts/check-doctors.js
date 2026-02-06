const { query } = require('./lib/db');

async function checkDoctors() {
    try {
        const result = await query(
            "SELECT id, first_name, last_name, role FROM staff WHERE role ILIKE 'Doctor' OR role ILIKE 'Medical Doctor' ORDER BY id ASC"
        );
        console.log('--- Doctors in DB ---');
        console.log(JSON.stringify(result.rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        process.exit(1);
    }
}

checkDoctors();
