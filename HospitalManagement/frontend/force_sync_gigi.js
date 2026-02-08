const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function forceSync() {
    try {
        const email = 'gigi@gmail.com';
        const newId = 'dev-gigi'; // Gigi's likely ID in dev mode screenshot

        console.log(`--- FORCING SYNC FOR ${email} ---`);

        // 1. Find the current record
        const res = await pool.query("SELECT id FROM patients WHERE LOWER(TRIM(email)) = $1", [email.toLowerCase().trim()]);

        if (res.rows.length === 0) {
            console.log('No patient found for email:', email);
            return;
        }

        const oldId = res.rows[0].id;
        console.log(`Found old ID: ${oldId}. Moving to New ID: ${newId}`);

        if (oldId === newId) {
            console.log('ID already matches newId. No sync needed.');
        } else {
            await pool.query('BEGIN');
            const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices', 'insurance_claims', 'vital_signs'];
            for (const t of tables) {
                const move = await pool.query(`UPDATE ${t} SET patient_id = $1 WHERE patient_id = $2`, [newId, oldId]);
                console.log(`Moved ${move.rowCount} records from ${t}`);
            }
            await pool.query('UPDATE patients SET id = $1 WHERE id = $2', [newId, oldId]);
            await pool.query('COMMIT');
            console.log('Sync complete.');
        }

        // Double check counts now
        console.log('\n--- VERIFYING NEW ID COUNTS ---');
        const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices', 'insurance_claims', 'vital_signs'];
        for (const t of tables) {
            const res = await pool.query(`SELECT count(*) FROM ${t} WHERE patient_id = $1`, [newId]);
            console.log(`${t}: ${res.rows[0].count}`);
        }

    } catch (err) {
        if (pool) await pool.query('ROLLBACK');
        console.error(err);
    } finally {
        await pool.end();
    }
}

forceSync();
