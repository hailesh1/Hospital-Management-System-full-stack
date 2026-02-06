import db from './lib/db.js';

async function checkDoctors() {
    try {
        console.log('--- Checking DB connection and Staff table ---');
        const allStaff = await db.query("SELECT id, name, first_name, last_name, email, role FROM staff LIMIT 20", []);
        console.log(`Found ${allStaff.rows.length} total staff members.`);
        console.log(JSON.stringify(allStaff.rows, null, 2));

        const doctors = await db.query(
            "SELECT id, first_name, last_name, role FROM staff WHERE role ILIKE 'Doctor' OR role ILIKE 'Medical Doctor' ORDER BY id ASC",
            []
        );
        console.log(`Found ${doctors.rows.length} doctors.`);
        console.log(JSON.stringify(doctors.rows, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error during diagnostic:', error);
        process.exit(1);
    }
}

checkDoctors();
