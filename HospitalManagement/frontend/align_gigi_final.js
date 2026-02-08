const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function align() {
    const targetId = 'dev-gigi-g'; // Consistent ID for "gigi g"
    const alternateId = 'dev-gig-g';
    const email = 'gigi@gmail.com';

    try {
        console.log(`--- ALIGNING RECORDS TO ID: ${targetId} ---`);

        // 1. Ensure the patient exists with the target ID
        const patientCheck = await pool.query('SELECT * FROM patients WHERE id = $1', [targetId]);
        if (patientCheck.rows.length === 0) {
            console.log(`Patient ${targetId} not found, checking by email...`);
            const byEmail = await pool.query('SELECT * FROM patients WHERE email = $1', [email]);
            if (byEmail.rows.length > 0) {
                const oldId = byEmail.rows[0].id;
                console.log(`Found patient with email ${email} and ID ${oldId}. Updating ID to ${targetId}...`);
                await pool.query('UPDATE patients SET id = $1, first_name = $2, last_name = $3 WHERE id = $4', [targetId, 'gigi', 'g', oldId]);
            } else {
                console.log('No patient found by email. Creating one...');
                await pool.query('INSERT INTO patients (id, email, first_name, last_name, registered_date, status) VALUES ($1, $2, $3, $4, NOW(), $5)', [targetId, email, 'gigi', 'g', 'ACTIVE']);
            }
        } else {
            console.log(`Patient ${targetId} confirmed.`);
            await pool.query('UPDATE patients SET first_name = $1, last_name = $2 WHERE id = $3', ['gigi', 'g', targetId]);
        }

        // 2. Migrate records from any other 'gig' or 'gigi' IDs
        const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices'];
        const otherIdsRes = await pool.query("SELECT id FROM patients WHERE (id ILIKE '%gig%' OR email ILIKE '%gigi%') AND id != $1", [targetId]);
        const otherIds = otherIdsRes.rows.map(r => r.id);
        if (!otherIds.includes(alternateId)) otherIds.push(alternateId);

        console.log('Migrating records from:', otherIds);

        for (const t of tables) {
            for (const oid of otherIds) {
                const updateResult = await pool.query(`UPDATE ${t} SET patient_id = $1 WHERE patient_id = $2`, [targetId, oid]);
                if (updateResult.rowCount > 0) {
                    console.log(` - Migrated ${updateResult.rowCount} records from ${oid} in table ${t}`);
                }
            }
        }

        console.log('\n--- ALIGNMENT COMPLETE ---');

        // Cleanup old duplicate patient records if any
        for (const oid of otherIds) {
            if (oid.startsWith('dev-')) {
                await pool.query('DELETE FROM patients WHERE id = $1', [oid]);
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

align();
