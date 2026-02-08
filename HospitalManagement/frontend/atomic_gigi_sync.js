const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', host: '127.0.0.1', database: 'hospital_management', password: '1234', port: 5432,
});

async function run() {
    try {
        const oldId = 'dev-gigi';
        const newId = 'dev-gigi-g';
        const email = 'gigi@gmail.com';

        console.log(`Starting migration: ${oldId} -> ${newId}`);

        await pool.query('BEGIN');

        // 1. Ensure new patient record exists
        const checkNew = await pool.query("SELECT id FROM patients WHERE id = $1", [newId]);
        if (checkNew.rows.length === 0) {
            console.log(`Creating new patient record for ${newId}`);
            // Copy data from old record but with new ID
            const oldPatient = await pool.query("SELECT * FROM patients WHERE id = $1", [oldId]);
            if (oldPatient.rows.length > 0) {
                const p = oldPatient.rows[0];
                const cols = Object.keys(p).filter(k => k !== 'id' && k !== 'email');
                const vals = cols.map(k => p[k]);
                // Clear old email temporarily to avoid unique constraint if we use same email
                await pool.query("UPDATE patients SET email = email || '.old' WHERE id = $1", [oldId]);

                const placeholders = cols.map((_, i) => `$${i + 3}`);
                await pool.query(
                    `INSERT INTO patients (id, email, ${cols.join(', ')}) VALUES ($1, $2, ${placeholders.join(', ')})`,
                    [newId, email, ...vals]
                );
            } else {
                // If old record somehow missing, create blank one
                await pool.query(
                    "INSERT INTO patients (id, email, first_name, last_name, status, registered_date) VALUES ($1, $2, 'Gigi', 'G', 'active', CURRENT_DATE)",
                    [newId, email]
                );
            }
        } else {
            console.log(`Target record ${newId} already exists. Updating its email and name.`);
            await pool.query("UPDATE patients SET email = $1, first_name = 'Gigi', last_name = 'G' WHERE id = $2", [email, newId]);
            // If the old record has the email we want, move its email aside
            await pool.query("UPDATE patients SET email = email || '.old' WHERE email = $1 AND id != $2", [email, newId]);
        }

        // 2. Update clinical tables
        const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices', 'insurance_claims', 'vital_signs'];
        for (const t of tables) {
            const res = await pool.query(`UPDATE ${t} SET patient_id = $1 WHERE patient_id = $2`, [newId, oldId]);
            console.log(`Table ${t}: moved ${res.rowCount} records`);
        }

        // 3. Delete old record
        await pool.query("DELETE FROM patients WHERE id = $1", [oldId]);
        await pool.query('COMMIT');
        console.log('Migration completed successfully!');

        // 3. Final verification
        const verify = await pool.query("SELECT id, first_name, last_name, email FROM patients WHERE id = $1", [newId]);
        console.table(verify.rows);

    } catch (err) {
        if (pool) await pool.query('ROLLBACK');
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

run();
