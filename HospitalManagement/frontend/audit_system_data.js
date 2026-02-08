const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function audit() {
    try {
        console.log('--- SYSTEM DATA AUDIT ---');

        // List all patients
        const patients = await pool.query("SELECT id, email, first_name, last_name, (first_name || ' ' || last_name) as name FROM patients ORDER BY registered_date DESC");
        console.log(`Found ${patients.rows.length} patients.`);

        const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices'];

        const auditData = [];

        for (const p of patients.rows) {
            const row = {
                id: p.id,
                email: p.email,
                name: p.name
            };

            for (const t of tables) {
                const count = await pool.query(`SELECT count(*) FROM ${t} WHERE patient_id = $1`, [p.id]);
                row[t] = parseInt(count.rows[0].count);
            }
            auditData.push(row);
        }

        console.table(auditData);

        // Also check for records with NO matching patient ID
        console.log('\n--- ORPHANED RECORDS (Non-existent patient_id) ---');
        for (const t of tables) {
            const orphans = await pool.query(`SELECT count(*) FROM ${t} WHERE patient_id NOT IN (SELECT id FROM patients)`);
            console.log(` - ${t}: ${orphans.rows[0].count}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

audit();
