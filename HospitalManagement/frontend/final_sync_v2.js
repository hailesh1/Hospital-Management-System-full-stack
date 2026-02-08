const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function finalSync() {
    try {
        const email = 'gigi@gmail.com';
        const newId = 'dev-gigi';

        console.log(`--- FINAL SYNC FOR ${email} ---`);

        // 1. Get the existing record
        const res = await pool.query("SELECT * FROM patients WHERE LOWER(TRIM(email)) = $1", [email.toLowerCase().trim()]);

        if (res.rows.length === 0) {
            console.log('No patient found for email:', email);
            return;
        }

        const oldPatient = res.rows[0];
        const oldId = oldPatient.id;

        if (oldId === newId) {
            console.log('Already synced.');
            return;
        }

        console.log(`Syncing ${oldId} -> ${newId}`);

        await pool.query('BEGIN');

        // 1. Rename email to avoid unique constraint
        await pool.query("UPDATE patients SET email = $1 WHERE id = $2", [email + '.tmp', oldId]);

        // 2. Insert new patient record (with proper ID)
        const cols = Object.keys(oldPatient).filter(k => k !== 'id' && k !== 'email');
        const vals = cols.map(k => oldPatient[k]);
        const placeholders = cols.map((_, i) => `$${i + 3}`);

        const insertQuery = `INSERT INTO patients (id, email, ${cols.join(', ')}) VALUES ($1, $2, ${placeholders.join(', ')})`;
        await pool.query(insertQuery, [newId, email, ...vals]);

        // 3. Update related records
        const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices', 'insurance_claims', 'vital_signs'];
        for (const t of tables) {
            const move = await pool.query(`UPDATE ${t} SET patient_id = $1 WHERE patient_id = $2`, [newId, oldId]);
            console.log(`Moved ${move.rowCount} records from ${t}`);
        }

        // 4. Delete old temporary record
        await pool.query("DELETE FROM patients WHERE id = $1", [oldId]);

        await pool.query('COMMIT');
        console.log('SUCCESS: All Gigi records are now linked to dev-gigi');

    } catch (err) {
        if (pool) await pool.query('ROLLBACK');
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

finalSync();
