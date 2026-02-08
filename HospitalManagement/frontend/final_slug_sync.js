const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function main() {
    try {
        const email = 'gigi@gmail.com';
        const newId = 'dev-gigi-g';

        console.log(`--- STANDARDIZED SYNC FOR ${email} ---`);

        // 1. Get all patient records with this email
        const res = await pool.query("SELECT id FROM patients WHERE LOWER(TRIM(email)) = $1", [email.toLowerCase().trim()]);
        const allIds = res.rows.map(r => r.id);

        if (allIds.length === 0) {
            console.log('No patient found for that email.');
            return;
        }

        console.log('Found IDs:', allIds);

        await pool.query('BEGIN');

        // 2. Ensure target patient exists
        const checkTarget = await pool.query("SELECT id FROM patients WHERE id = $1", [newId]);
        if (checkTarget.rows.length === 0) {
            console.log('Creating standardized target record...');
            // Get data from first available record
            const source = (await pool.query("SELECT * FROM patients WHERE id = $1", [allIds[0]])).rows[0];

            // Clean up email from others to avoid unique constraint
            await pool.query("UPDATE patients SET email = email || '.old' WHERE email = $1", [email]);

            const cols = Object.keys(source).filter(k => k !== 'id' && k !== 'email');
            const vals = [newId, email, ...cols.map(c => (c === 'first_name' ? 'Gigi' : (c === 'last_name' ? 'G' : source[c])))];
            const pCount = vals.length;
            const placeholders = vals.map((_, i) => `$${i + 1}`);

            await pool.query(`INSERT INTO patients (id, email, ${cols.join(', ')}) VALUES (${placeholders.join(', ')})`, vals);
        } else {
            console.log('Target record exists. Updating name.');
            await pool.query("UPDATE patients SET first_name = 'Gigi', last_name = 'G' WHERE id = $1", [newId]);
        }

        // 3. Migrate clinical data from all non-target IDs
        const otherIds = allIds.filter(id => id !== newId);
        const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices', 'insurance_claims', 'vital_signs'];

        for (const oldId of otherIds) {
            for (const t of tables) {
                const move = await pool.query(`UPDATE ${t} SET patient_id = $1 WHERE patient_id = $2`, [newId, oldId]);
                console.log(`Moved ${move.rowCount} from ${t} (ID: ${oldId})`);
            }
            await pool.query("DELETE FROM patients WHERE id = $1", [oldId]);
        }

        await pool.query('COMMIT');
        console.log('--- SYNC COMPLETE ---');

    } catch (err) {
        if (pool) await pool.query('ROLLBACK');
        console.error('Migration Error:', err);
    } finally {
        await pool.end();
    }
}

main();
Riverside:
