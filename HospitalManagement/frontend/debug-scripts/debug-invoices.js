const { query } = require('./lib/db');

async function debug() {
    try {
        console.log('--- Checking Invoice Schema ---');
        const schemaRes = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'invoices'");
        console.log(JSON.stringify(schemaRes.rows, null, 2));

        console.log('\n--- Testing Query ---');
        const patientId = '138e2ba8-853d-4db1-8b2c-27cdcf72e16c'; // The ID from the user error

        // Simplified query from the API
        const text = `
      SELECT 
        i.id,
        COALESCE(p.first_name || ' ' || p.last_name, i.patient_name, 'Unknown Patient') as "patientName",
        to_char(i.created_at, 'YYYY-MM-DD') as date,
        to_char(i.due_date, 'YYYY-MM-DD') as "dueDate",
        i.amount as total,
        i.status,
        i.items,
        i.amount as subtotal,
        0 as tax,
        to_char(i.paid_date, 'YYYY-MM-DD') as "paidDate",
        i.payment_method as "paymentMethod"
      FROM invoices i
      LEFT JOIN patients p ON i.patient_id = p.id
      WHERE i.patient_id = $1
      ORDER BY i.created_at DESC
    `;

        const res = await query(text, [patientId]);
        console.log('Query successful, rows:', res.rows.length);
        console.log(JSON.stringify(res.rows, null, 2));

    } catch (error) {
        console.error('DEBUG ERROR:', error);
    }
}

debug();
