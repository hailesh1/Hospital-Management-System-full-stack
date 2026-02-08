const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', host: '127.0.0.1', database: 'hospital_management', password: '1234', port: 5432,
});

async function migrate() {
    try {
        const email = 'gigi@gmail.com';
        const oldId = 'dev-gigi';
        const newId = 'dev-gigi-g';

        console.log(`Migrating Gigi: ${oldId} -> ${newId}`);

        await pool.query('BEGIN');

        // 1. Ensure new patient record exists or update it
        const checkNew = await pool.query("SELECT id FROM patients WHERE id = $1", [newId]);
        if (checkNew.rows.length === 0) {
            console.log('Creating new record for dev-gigi-g');
            await pool.query("UPDATE patients SET email = email || '.old' WHERE email = $1 AND id != $2", [email, newId]);
            await pool.query(`
        INSERT INTO patients (id, email, first_name, last_name, status, registered_date)
        VALUES ($1, $2, 'Gigi', 'G', 'active', CURRENT_DATE)
      `, [newId, email]);
        } else {
            console.log('Updating existing dev-gigi-g record');
            await pool.query("UPDATE patients SET first_name = 'Gigi', last_name = 'G', email = $1 WHERE id = $2", [email, newId]);
        }

        // 2. Migrate records from dev-gigi
        const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices', 'insurance_claims', 'vital_signs'];
        for (const t of tables) {
            const res = await pool.query(`UPDATE ${t} SET patient_id = $1 WHERE patient_id = $2`, [newId, oldId]);
            console.log(`Table ${t}: Moved ${res.rowCount} records`);
        }

        // 3. Delete old record
        await pool.query("DELETE FROM patients WHERE id = $1", [oldId]);

        await pool.query('COMMIT');
        console.log('Migration Successful!');
    } catch (err) {
        if (pool) await pool.query('ROLLBACK');
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

migrate();
Riverside:
Riverside:
