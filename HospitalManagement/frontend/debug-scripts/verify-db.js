const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/hospital_db"
});

async function verify() {
    try {
        await client.connect();
        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables in database:');
        res.rows.forEach(row => console.log(' - ' + row.table_name));

        const checkTable = res.rows.find(row => row.table_name === 'time_off_requests');
        if (checkTable) {
            console.log('SUCCESS: "time_off_requests" table exists.');
        } else {
            console.log('FAILURE: "time_off_requests" table NOT found.');
        }

    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        await client.end();
    }
}

verify();
