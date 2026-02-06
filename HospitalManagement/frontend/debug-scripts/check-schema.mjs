import db from './lib/db.js';

async function checkSchema() {
    try {
        const staff = await db.query(
            "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'staff'",
            []
        );
        console.log('--- staff Columns ---');
        console.table(staff.rows);

        const tor = await db.query(
            "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'time_off_requests'",
            []
        );
        console.log('--- time_off_requests Columns ---');
        console.table(tor.rows);

        process.exit(0);
    } catch (error) {
        console.error('Error fetching schema:', error);
        process.exit(1);
    }
}

checkSchema();
