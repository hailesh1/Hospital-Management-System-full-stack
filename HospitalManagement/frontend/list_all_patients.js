const { query } = require('./lib/db');

async function listAllPatients() {
    try {
        console.log('📋 Fetching all patients from database...\n');

        const result = await query(`
      SELECT 
        id,
        first_name,
        last_name,
        email,
        phone,
        status
      FROM patients
      ORDER BY first_name, last_name
    `);

        if (result.rows.length === 0) {
            console.log('❌ No patients found in database.');
            return;
        }

        console.log(`✅ Found ${result.rows.length} patients:\n`);
        console.log('═'.repeat(120));
        console.log('ID'.padEnd(40) + 'Name'.padEnd(30) + 'Email'.padEnd(35) + 'Status');
        console.log('═'.repeat(120));

        result.rows.forEach((patient, index) => {
            const fullName = `${patient.first_name} ${patient.last_name}`;
            console.log(
                `${(index + 1).toString().padStart(2)}. ${patient.id.padEnd(35)} ${fullName.padEnd(25)} ${(patient.email || 'N/A').padEnd(30)} ${patient.status || 'N/A'}`
            );
        });

        console.log('═'.repeat(120));
        console.log(`\n📊 Total: ${result.rows.length} patients`);

    } catch (error) {
        console.error('❌ Error fetching patients:', error.message);
    } finally {
        process.exit(0);
    }
}

listAllPatients();
