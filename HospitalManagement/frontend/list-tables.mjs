import db from './lib/db.js';

async function listTables() {
    try {
        const result = await db.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'",
            []
        );
        console.log('--- Tables ---');
        console.log(JSON.stringify(result.rows.map(r => r.table_name), null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error listing tables:', error);
        process.exit(1);
    }
}

listTables();
