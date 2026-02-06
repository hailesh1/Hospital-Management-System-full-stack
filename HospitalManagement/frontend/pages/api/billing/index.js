import { query } from '@/lib/db';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const result = await query(`
          SELECT i.*, 
          COALESCE((SELECT description FROM invoice_items WHERE invoice_id = i.id LIMIT 1), 'General Service') as type
          FROM invoices i 
          ORDER BY i.created_at DESC
        `);
                res.status(200).json(result.rows);
            } catch (error) {
                console.error('Error fetching invoices:', error);
                res.status(500).json({ error: 'Failed to fetch invoices' });
            }
            break;

        case 'POST':
            try {
                const { patientId, patientName, date, dueDate, items, subtotal, tax, total, status } = req.body;

                // Start transaction
                await query('BEGIN');

                // Insert invoice
                const invoiceRes = await query(
                    `INSERT INTO invoices (
            id, patient_id, patient_name, date, due_date, 
            subtotal, tax, total, status, created_at, updated_at
          ) VALUES (
            uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()
          ) RETURNING id`,
                    [patientId.toString(), patientName, date, dueDate, subtotal, tax, total, (status || 'PENDING').toUpperCase()]
                );

                const invoiceId = invoiceRes.rows[0].id;

                // Insert items
                for (const item of items) {
                    await query(
                        `INSERT INTO invoice_items (
              id, invoice_id, description, quantity, unit_price, total
            ) VALUES (
              uuid_generate_v4(), $1, $2, $3, $4, $5
            )`,
                        [invoiceId, item.description, item.quantity, item.unitPrice, item.total]
                    );
                }

                await query('COMMIT');

                // Fetch complete invoice to return
                const newInvoice = await query('SELECT * FROM invoices WHERE id = $1', [invoiceId]);
                res.status(201).json(newInvoice.rows[0]);

            } catch (error) {
                await query('ROLLBACK');
                console.error('Error creating invoice:', error);
                res.status(500).json({ error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
