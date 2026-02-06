import { query } from '@/lib/db';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const result = await query(`
                    SELECT ic.*, p.first_name || ' ' || p.last_name as patient_name 
                    FROM insurance_claims ic
                    JOIN patients p ON ic.patient_id = p.id
                    ORDER BY ic.created_at DESC
                `);
                res.status(200).json(result.rows);
            } catch (error) {
                console.error('Error fetching claims:', error);
                res.status(500).json({ error: 'Failed to fetch claims' });
            }
            break;

        case 'POST':
            try {
                const { patientId, provider, policyNumber, amount } = req.body;

                if (!patientId || !provider || !policyNumber || !amount) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const result = await query(
                    `INSERT INTO insurance_claims (id, patient_id, provider, policy_number, amount, status) 
                     VALUES (uuid_generate_v4(), $1, $2, $3, $4, 'Pending') 
                     RETURNING *`,
                    [patientId, provider, policyNumber, amount]
                );

                res.status(201).json(result.rows[0]);
            } catch (error) {
                console.error('Error creating claim:', error);
                res.status(500).json({ error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
