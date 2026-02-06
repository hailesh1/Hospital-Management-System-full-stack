import db from './lib/db.js';

async function checkData() {
    try {
        const tables = await db.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'prescriptions'",
            []
        );
        console.log('--- Prescriptions Table Exists? ---');
        console.log(tables.rows.length > 0);

        const records = await db.query("SELECT DISTINCT type FROM medical_records", []);
        console.log('--- medical_records Types ---');
        console.log(JSON.stringify(records.rows.map(r => r.type), null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error checking data:', error);
        process.exit(1);
    }
}

checkData();
