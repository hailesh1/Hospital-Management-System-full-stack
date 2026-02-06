import db from './lib/db.js';

async function checkPatientsSchema() {
    try {
        const result = await db.query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'patients'",
            []
        );
        console.log('--- patients Columns ---');
        console.log(JSON.stringify(result.rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error fetching schema:', error);
        process.exit(1);
    }
}

checkPatientsSchema();
