const { query } = require('./lib/db');

async function checkStats() {
    console.log('🔍 Checking Database Stats Data...');

    try {
        // 1. Staff Status
        console.log('\n--- Staff Status ---');
        const staffRes = await query(`SELECT id, role, status FROM staff`);
        staffRes.rows.forEach(r => console.log(`- ${r.role}: ${r.status}`));

        const activeStaffCount = await query(`SELECT COUNT(*) FROM staff WHERE LOWER(status) = 'active'`);
        console.log(`✅ Active Staff Count (Query): ${activeStaffCount.rows[0].count}`);

        // 2. Patient Status
        console.log('\n--- Patient Status ---');
        const patRes = await query(`SELECT id, status FROM patients LIMIT 10`);
        patRes.rows.forEach(r => console.log(`- Patient: ${r.status}`));

        const activePatCount = await query(`SELECT COUNT(*) FROM patients WHERE LOWER(status) = 'active'`);
        console.log(`✅ Active Patients Count (Query): ${activePatCount.rows[0].count}`);

        // 3. Invoices (Revenue)
        console.log('\n--- Invoices ---');
        const invRes = await query(`SELECT id, total, status, created_at FROM invoices`);
        invRes.rows.forEach(r => console.log(`- Invoice: ${r.total} (${r.status}) - ${r.created_at}`));

        const todayRev = await query(`SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE LOWER(status) = 'paid' AND DATE(created_at) = CURRENT_DATE`);
        console.log(`💰 Revenue (Today): ${todayRev.rows[0].total}`);

        const monthRev = await query(`SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE LOWER(status) = 'paid' AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`);
        console.log(`💰 Revenue (Month): ${monthRev.rows[0].total}`);

    } catch (error) {
        console.error('❌ Check Failed:', error);
    }
}

checkStats();
