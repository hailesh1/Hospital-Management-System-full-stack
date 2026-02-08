const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function verify() {
    try {
        const id = 'fba9f8eb-1c6f-4033-afc6-34cf1e386dc1';
        console.log('--- VERIFYING DATA FOR ID:', id, '---');

        const tables = ['prescriptions', 'lab_tests', 'invoices', 'medical_records'];
        for (const t of tables) {
            console.log(`\nChecking ${t}...`);
            const res = await pool.query(`SELECT * FROM ${t} WHERE patient_id = $1`, [id]);
            console.log(`Count: ${res.rows.length}`);
            if (res.rows.length > 0) {
                console.table(res.rows.map(r => {
                    // Remove large fields for readability
                    const { items, notes, diagnosis, treatment, ...small } = r;
                    return small;
                }));
            }
        }

        // Check if any status filters might be interfering
        // Current patient's dashboard uses status='active' for prescriptions
        const activePr = await pool.query("SELECT count(*) FROM prescriptions WHERE patient_id = $1 AND LOWER(status) = 'active'", [id]);
        console.log('\nActive Prescriptions count:', activePr.rows[0].count);

    } catch (err) {
        console.error('Verification script failed:', err);
    } finally {
        await pool.end();
    }
}

verify();
