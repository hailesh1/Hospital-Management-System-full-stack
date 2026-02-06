const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    connectionTimeoutMillis: 2000,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    } else {
        console.log('Connection successful:', res.rows[0]);
        process.exit(0);
    }
});
