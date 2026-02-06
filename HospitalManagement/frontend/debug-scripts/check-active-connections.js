const { query } = require('./lib/db');

async function checkConnections() {
    try {
        const res = await query('SELECT count(*) FROM pg_stat_activity');
        console.log('Active connections:', res.rows[0].count);

        const details = await query('SELECT pid, state, query, wait_event_type, wait_event FROM pg_stat_activity');
        console.log('Connection details:', JSON.stringify(details.rows, null, 2));
    } catch (err) {
        console.error('Error checking connections:', err.message);
    }
    process.exit();
}

checkConnections();
