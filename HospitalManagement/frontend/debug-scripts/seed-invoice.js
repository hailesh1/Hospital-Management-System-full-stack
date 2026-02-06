const { query } = require('./lib/db');

async function seedInvoice() {
    try {
        // 1. Get the first patient
        const patientRes = await query('SELECT * FROM patients LIMIT 1');
        if (patientRes.rows.length === 0) {
            console.log('No patients found. Create a patient first.');
            return;
        }
        const patient = patientRes.rows[0];
        console.log(`Found patient: ${patient.first_name} ${patient.last_name} (${patient.id})`);

        // 2. Insert an invoice
        const items = JSON.stringify([
            { description: "General Consultation", quantity: 1, unitPrice: 500, amount: 500 },
            { description: "Blood Test", quantity: 1, unitPrice: 750, amount: 750 }
        ]);

        // Check if invoice exists
        const checkRes = await query('SELECT id FROM invoices WHERE patient_id = $1', [patient.id]);
        if (checkRes.rows.length > 0) {
            console.log('Invoice already exists for this patient.');
            return;
        }

        const insertRes = await query(`
      INSERT INTO invoices (
        id, patient_id, patient_name, amount, status, due_date, created_at, items, payment_method
      ) VALUES (
        uuid_generate_v4(), $1, $2, $3, $4, NOW() + INTERVAL '7 days', NOW() - INTERVAL '2 days', $5, $6
      ) RETURNING id
    `, [
            patient.id,
            `${patient.first_name} ${patient.last_name}`,
            1250.00,
            'pending',
            items,
            'Credit Card'
        ]);

        console.log(`Created sample invoice with ID: ${insertRes.rows[0].id}`);

    } catch (error) {
        console.error('Error seeding invoice:', error);
    }
}

seedInvoice();
