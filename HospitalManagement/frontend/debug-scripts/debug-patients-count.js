require('dotenv').config({ path: '.env.local' });
const { query } = require('./lib/db');

async function checkPatients() {
    try {
        console.log('Checking patients count...');
        const result = await query('SELECT COUNT(*) FROM patients');
        console.log('Total patients in DB:', result.rows[0].count);

        const sample = await query('SELECT id, first_name, status FROM patients LIMIT 5');
        console.log('Sample patients:', sample.rows);
    } catch (error) {
        console.error('Database query failed:', error);
    }
}

checkPatients();
