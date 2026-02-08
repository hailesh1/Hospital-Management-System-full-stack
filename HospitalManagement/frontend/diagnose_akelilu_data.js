const { query } = require('./lib/db');

// Known IDs for Akelilu
const TARGET_UUID = 'd2c6b1a8-7fcd-4127-b04a-1d61528bb06e'; // The real Keycloak ID
const LEGACY_IDS = [
    'dev-akelilu',
    'dev-akelilu@element.com',
    'akelilu',
    'dev-akelilu@example.com'
];

async function diagnose() {
    console.log('🔍 Diagnosing Akelilu Data Fragmentation...');
    console.log(`🎯 Target ID (Keycloak): ${TARGET_UUID}`);

    // Check Patients Table
    console.log('\n--- Patients Table ---');
    const p1 = await query(`SELECT id, first_name, last_name, email FROM patients WHERE email ILIKE '%akelilu%' OR first_name ILIKE '%akelilu%'`);
    p1.rows.forEach(r => console.log(`- Found Patient: ${r.id} (${r.first_name} ${r.last_name}, ${r.email})`));

    // Check Related Tables
    const tables = ['prescriptions', 'medical_records', 'lab_tests', 'invoices', 'appointments'];

    for (const table of tables) {
        console.log(`\n--- ${table} ---`);

        // Count for Target
        const targetCount = await query(`SELECT COUNT(*) FROM ${table} WHERE patient_id = $1`, [TARGET_UUID]);
        console.log(`✅ [TARGET] ${TARGET_UUID}: ${targetCount.rows[0].count} records`);

        // Count for Legacy
        for (const badId of LEGACY_IDS) {
            const badCount = await query(`SELECT COUNT(*) FROM ${table} WHERE patient_id = $1`, [badId]);
            if (parseInt(badCount.rows[0].count) > 0) {
                console.log(`⚠️ [LEGACY] ${badId}: ${badCount.rows[0].count} records (Needs Migration)`);
            }
        }
    }
}

diagnose();
