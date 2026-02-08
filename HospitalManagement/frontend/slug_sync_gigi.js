const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function slugSync() {
    try {
        const email = 'gigi@gmail.com';
        const newId = 'dev-gigi-g'; // Standardized slug
        const newName = 'Gigi G';

        console.log(`--- SLUG SYNC FOR ${email} ---`);

        // 1. Find ANY patient with this email
        const res = await pool.query("SELECT id, first_name, last_name FROM patients WHERE LOWER(TRIM(email)) = $1", [email.toLowerCase().trim()]);

        if (res.rows.length === 0) {
            console.log('No patient found.');
            return;
        }

        await pool.query('BEGIN');

        // 2. Identify old IDs (there might be multiple if duplicates exist)
        const records = res.rows;
        const oldIds = records.map(r => r.id).filter(id => id !== newId);
        console.log('Old IDs to migrate from:', oldIds);

        // 3. Ensure the target record exists
        const checkNew = await pool.query("SELECT id FROM patients WHERE id = $1", [newId]);
        if (checkNew.rows.length === 0) {
            console.log('Creating slugified patient record...');
            const oldPatient = (await pool.query("SELECT * FROM patients WHERE id = $1", [records[0].id])).rows[0];
            const cols = Object.keys(oldPatient).filter(k => k !== 'id' && k !== 'email');
            const vals = cols.map(k => (k === 'first_name' ? 'Gigi' : (k === 'last_name' ? 'G' : oldPatient[k])));
            const placeholders = cols.map((_, i) => `$${i + 3}`);

            // Temporarily move email 
            await pool.query("UPDATE patients SET email = email || '.old' WHERE email = $1", [email]);

            const insertQuery = `INSERT INTO patients (id, email, ${cols.join(', ')}) VALUES ($1, $2, ${placeholders.join(', ')})`;
            await pool.query(insertQuery, [newId, email, ...vals]);
        } else {
            console.log('Target record already exists. Updating name...');
            await pool.query("UPDATE patients SET first_name = 'Gigi', last_name = 'G' WHERE id = $1", [newId]);
        }

        // 4. Move all clinical data from ALL old IDs
        const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices', 'insurance_claims', 'vital_signs'];
        for (const oldId of oldIds) {
            for (const t of tables) {
                const move = await pool.query(`UPDATE ${t} SET patient_id = $1 WHERE patient_id = $2`, [newId, oldId]);
                console.log(`Moved ${move.rowCount} records from ${t} (Old ID: ${oldId})`);
            }
            // Delete empty old record
            await pool.query("DELETE FROM patients WHERE id = $1", [oldId]);
        }

        await pool.query('COMMIT');
        console.log('--- SLUG SYNC SUCCESSFUL ---');

        // Final Counts for dev-gigi-g
        for (const t of tables) {
            const count = await pool.query(`SELECT count(*), (SELECT patient_name FROM ${t} WHERE patient_id = $1 LIMIT 1) as stored_name FROM ${t} WHERE patient_id = $1 GROUP BY patient_id`, [newId]);
            if (count.rows.length > 0) {
                console.log(`${t}: ${count.rows[0].count} records (Stored name: ${count.rows[0].stored_name})`);
            } else {
                console.log(`${t}: 0 records`);
            }
        }

    } catch (err) {
        if (pool) await pool.query('ROLLBACK');
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
}

slugSync();
Riverside:
