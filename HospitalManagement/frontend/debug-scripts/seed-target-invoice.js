const { query } = require('./lib/db');

async function seedTargetInvoice() {
    const targetPatientId = '138e2ba8-853d-4db1-8b2c-27cdcf72e16c';

    try {
        // 1. Check if patient exists
        const patientRes = await query('SELECT * FROM patients WHERE id = $1', [targetPatientId]);

        let patientName = 'Unknown';
        if (patientRes.rows.length === 0) {
            console.log('Target patient not found. Creating temporary mock patient for invoice...');
            // In a real scenario we might error out, but here let's ensure the invoice can exist
            patientName = 'Target User';
        } else {
            const p = patientRes.rows[0];
            patientName = `${p.first_name} ${p.last_name}`;
            console.log(`Found target patient: ${patientName}`);
        }

        // 2. Insert invoice linked to this ID
        const items = JSON.stringify([
            { description: "Specialist Visit", quantity: 1, unitPrice: 2000, amount: 2000 }
        ]);

        // Check if invoice exists
        const checkRes = await query('SELECT id FROM invoices WHERE patient_id = $1', [targetPatientId]);
        if (checkRes.rows.length > 0) {
            console.log(`Invoice already exists for target patient ${targetPatientId}.`);
            return;
        }

        const insertRes = await query(`
      INSERT INTO invoices (
        id, patient_id, patient_name, amount, status, due_date, created_at, items, payment_method
      ) VALUES (
        uuid_generate_v4(), $1, $2, $3, $4, NOW() + INTERVAL '14 days', NOW(), $5, $6
      ) RETURNING id
    `, [
            targetPatientId,
            patientName,
            2000.00,
            'pending',
            items,
            'Insurance'
        ]);

        console.log(`Created targeted invoice with ID: ${insertRes.rows[0].id}`);

    } catch (error) {
        console.error('Error seeding target invoice:', error);
    }
}

seedTargetInvoice();
