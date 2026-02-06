import { query } from '@/lib/db';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            try {
                const invoice = await query('SELECT * FROM invoices WHERE id = $1', [id]);
                if (invoice.rowCount === 0) {
                    return res.status(404).json({ error: 'Invoice not found' });
                }

                const items = await query('SELECT * FROM invoice_items WHERE invoice_id = $1', [id]);

                res.status(200).json({
                    ...invoice.rows[0],
                    items: items.rows
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        case 'PUT':
            try {
                const { status } = req.body;
                const statusUpper = status ? status.toUpperCase() : status;

                // Check if updated_at exists
                const checkCol = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'updated_at'");
                const updateQuery = checkCol.rows.length > 0
                    ? 'UPDATE invoices SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *'
                    : 'UPDATE invoices SET status = $1 WHERE id = $2 RETURNING *';

                const result = await query(updateQuery, [statusUpper, id]);

                if (result.rowCount === 0) {
                    return res.status(404).json({ error: 'Invoice not found' });
                }

                res.status(200).json(result.rows[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
