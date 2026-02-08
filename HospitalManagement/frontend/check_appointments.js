const { query } = require('./lib/db');

async function checkAppointments() {
    console.log('🔍 Checking Appointments & Doctors...');

    try {
        // 1. Check Doctors
        console.log('\n--- Doctors ---');
        const docs = await query(`SELECT id, first_name, last_name, email FROM staff WHERE role ILIKE '%doctor%'`);
        docs.rows.forEach(d => console.log(`- Dr. ${d.first_name} ${d.last_name} (${d.email}) ID: ${d.id}`));

        // 2. Check Appointments Today
        console.log('\n--- Appointments (Today) ---');
        // Simple query first without timezone complexity to see raw data
        const appts = await query(`
            SELECT id, doctor_id, patient_id, date, status 
            FROM appointments 
            order by date desc limit 10
        `);

        appts.rows.forEach(a => console.log(`- Appt: ${a.date} | Dr: ${a.doctor_id} | Pat: ${a.patient_id} | Status: ${a.status}`));

        // 3. Check specific count for Dawit (if found)
        const dawit = docs.rows.find(d => d.email.includes('dawit'));
        if (dawit) {
            console.log(`\n--- Specific Check for Dawit (${dawit.id}) ---`);
            const dawitAppts = await query(`SELECT count(*) FROM appointments WHERE doctor_id = $1`, [dawit.id]);
            console.log(`Total Appts: ${dawitAppts.rows[0].count}`);

            const todayAppts = await query(`
                SELECT count(*) FROM appointments 
                WHERE doctor_id = $1 
                AND date = DATE(CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Addis_Ababa')
            `, [dawit.id]);
            console.log(`Today's Appts (Timezone Corrected): ${todayAppts.rows[0].count}`);
        }

    } catch (error) {
        console.error('❌ Check Failed:', error);
    }
}

checkAppointments();
