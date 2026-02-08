const { query } = require('./lib/db');

async function fixIdMismatch() {
    try {
        console.log('🔧 FIXING ID MISMATCH\n');
        console.log('═'.repeat(80));

        // The ID in your browser session (from screenshot)
        const browserSessionId = 'dev-akelilu@example.com';

        // The ID where we put the data
        const dataId = 'dev-akelilu';

        console.log(`\n📋 Migrating data from [${dataId}] to [${browserSessionId}]...\n`);

        // Step 1: Check if browserSessionId patient exists
        const checkRes = await query('SELECT id FROM patients WHERE id = $1', [browserSessionId]);

        if (checkRes.rows.length === 0) {
            console.log(`1️⃣  Creating patient record for ${browserSessionId}...`);
            // We need to create it, but we can't have duplicate emails.
            // So first, update the old record's email to free it up
            await query("UPDATE patients SET email = 'temp-old@example.com' WHERE id = $1", [dataId]);

            await query(`
          INSERT INTO patients (id, first_name, last_name, email, phone, date_of_birth, gender, registered_date, status)
          VALUES ($1, 'Akelilu', 'Besufekad', 'akelilu@example.com', '0912345678', '1990-01-01', 'MALE', CURRENT_DATE, 'ACTIVE')
        `, [browserSessionId]);
        } else {
            console.log(`1️⃣  Patient ${browserSessionId} already exists.`);
        }

        // Step 2: Migrate all data
        const tables = ['medical_records', 'prescriptions', 'lab_tests', 'invoices', 'appointments'];

        for (const table of tables) {
            const res = await query(`
            UPDATE ${table} 
            SET patient_id = $1, patient_name = 'Akelilu Besufekad'
            WHERE patient_id = $2
            RETURNING id
        `, [browserSessionId, dataId]);
            console.log(`   ✅ Migrated ${res.rowCount} ${table}`);
        }

        // Step 3: Cleanup old ID if it has no data
        console.log('\n3️⃣  Cleaning up old ID...');
        await query('DELETE FROM patients WHERE id = $1', [dataId]);
        console.log(`   ✅ Deleted ID ${dataId}`);

        console.log('\n═'.repeat(80));
        console.log('🎉 DONE! Refresh your browser now.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
}

fixIdMismatch();
