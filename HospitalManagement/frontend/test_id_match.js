const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function testMatch() {
    const targetId = 'dev-gigi-g';
    try {
        console.log(`--- TESTING EXACT MATCH FOR ID: "${targetId}" ---`);

        // 1. Basic match
        const res1 = await pool.query('SELECT id FROM patients WHERE id = $1', [targetId]);
        console.log(`Exact match: ${res1.rows.length > 0 ? '✅ FOUND' : '❌ NOT FOUND'}`);

        // 2. Case insensitive match
        const res2 = await pool.query('SELECT id FROM patients WHERE LOWER(id) = LOWER($1)', [targetId]);
        console.log(`Case-insensitive match: ${res2.rows.length > 0 ? '✅ FOUND' : '❌ NOT FOUND'}`);

        // 3. Trimmed match
        const res3 = await pool.query('SELECT id FROM patients WHERE TRIM(id) = TRIM($1)', [targetId]);
        console.log(`Trimmed match: ${res3.rows.length > 0 ? '✅ FOUND' : '❌ NOT FOUND'}`);

        // 4. List all IDs again just to be sure
        const res4 = await pool.query('SELECT id FROM patients');
        console.log('\nAll IDs in DB:');
        res4.rows.forEach(r => console.log(` - "${r.id}" (len: ${r.id.length})`));

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

testMatch();
