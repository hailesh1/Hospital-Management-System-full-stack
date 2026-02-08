const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function safeSync() {
    try {
        const email = 'gigi@gmail.com';
        const newId = 'dev-gigi';

        console.log(`--- SAFE SYNC FOR ${email} ---`);

        // 1. Get the existing record
        const res = await pool.query("SELECT * FROM patients WHERE LOWER(TRIM(email)) = $1", [email.toLowerCase().trim()]);

        if (res.rows.length === 0) {
            console.log('No patient found for email:', email);
            return;
        }

        const oldPatient = res.rows[0];
        const oldId = oldPatient.id;
        console.log(`Found old ID: ${oldId}. Moving to New ID: ${newId}`);

        if (oldId === newId) {
            console.log('ID already matched. Done.');
            return;
        }

        await pool.query('BEGIN');

        // 2. Create the new record if it doesn't exist
        const checkNew = await pool.query("SELECT id FROM patients WHERE id = $1", [newId]);
        if (checkNew.rows.length === 0) {
            console.log('Creating new patient record...');
            const cols = Object.keys(oldPatient).filter(k => k !== 'id');
            const vals = cols.map(k => oldPatient[k]);
            const placeholders = cols.map((_, i) => `$${i + 2}`);

            const insertQuery = `INSERT INTO patients (id, ${cols.join(', ')}) VALUES ($1, ${placeholders.join(', ')})`;
            await pool.query(insertQuery, [newId, ...vals]);
        } else {
            console.log('New patient record already exists.');
        }

        // 3. Update all clinical/billing tables
        const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices', 'insurance_claims', 'vital_signs'];
        for (const t of tables) {
            const move = await pool.query(`UPDATE ${t} SET patient_id = $1 WHERE patient_id = $2`, [newId, oldId]);
            console.log(`Moved ${move.rowCount} records from ${t}`);
        }

        // 4. Delete the old record
        await pool.query("DELETE FROM patients WHERE id = $1", [oldId]);
        console.log('Deleted old patient record.');

        await pool.query('COMMIT');
        console.log('--- ALL RECORDS MOVED SUCCESSFULLY ---');

    } catch (err) {
        if (pool) await pool.query('ROLLBACK');
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

safeSync();
