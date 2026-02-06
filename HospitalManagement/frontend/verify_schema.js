const { query } = require('./lib/db');

async function checkSchema() {
    try {
        console.log('--- Appointments Table ---');
        const appts = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'appointments' ORDER BY ordinal_position");
        console.table(appts.rows);

        console.log('\n--- Medical Records Table ---');
        const records = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'medical_records' ORDER BY ordinal_position");
        console.table(records.rows);

        console.log('\n--- Verifying Columns ---');
        const checkTitle = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'title'");
        console.log('Title column exists in medical_records:', checkTitle.rows.length > 0);

        const checkApptCols = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'appointments' AND column_name IN ('notes', 'status', 'date', 'time', 'patient_name', 'doctor_name')");
        console.log('Number of required columns in appointments:', checkApptCols.rows.length);

    } catch (err) {
        console.error(err);
    }
}

checkSchema();
