const { query } = require('./lib/db');

// Configuration
const TARGET_UUID = 'd2c6b1a8-7fcd-4127-b04a-1d61528bb06e'; // The real Keycloak ID
const LEGACY_IDS = [
    'dev-akelilu',
    'dev-akelilu@element.com',
    'akelilu',
    'dev-akelilu@example.com' // Found in diagnosis
];

async function migrate() {
    console.log('🚀 Starting Data Consolidation for Akelilu...');
    console.log(`🎯 Moving all data to: ${TARGET_UUID}`);

    try {
        // 1. Update Patients Table (Ensure target exists and clean up old ones)
        // We already know TARGET_UUID exists from the diagnosis.
        // We should delete the old patient records to prevent confusion, 
        // BUT only after moving their data.

        const tables = ['prescriptions', 'medical_records', 'lab_tests', 'invoices', 'appointments'];

        for (const table of tables) {
            console.log(`\n📦 Migrating ${table}...`);

            for (const oldId of LEGACY_IDS) {
                const res = await query(`UPDATE ${table} SET patient_id = $1 WHERE patient_id = $2 RETURNING id`, [TARGET_UUID, oldId]);
                if (res.rowCount > 0) {
                    console.log(`   ✅ Moved ${res.rowCount} records from '${oldId}'`);
                }
            }
        }

        console.log('\n🗑️ Cleaning up legacy patient records...');
        for (const oldId of LEGACY_IDS) {
            // Only delete if it's not the target (sanity check)
            if (oldId !== TARGET_UUID) {
                const res = await query(`DELETE FROM patients WHERE id = $1`, [oldId]);
                if (res.rowCount > 0) {
                    console.log(`   ✅ Deleted legacy patient record: ${oldId}`);
                }
            }
        }

        console.log('\n🎉 CONSOLIDATION COMPLETE');
        console.log('Akelilu should now see all 10 Prescriptions, 7 Lab Tests, etc.');

    } catch (error) {
        console.error('❌ Migration Failed:', error);
    }
}

migrate();
