import { query } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const result = await query(`
            SELECT DISTINCT ON (p.id) 
                p.first_name || ' ' || p.last_name as name,
                to_char(a.appointment_date, 'YYYY-MM-DD') as visit_date,
                EXTRACT(DAY FROM NOW() - a.appointment_date) as days_ago
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            WHERE a.appointment_date < CURRENT_DATE
            ORDER BY p.id, a.appointment_date DESC
            LIMIT 5
        `);

        // Format days ago
        const formatted = result.rows.map(row => ({
            name: row.name,
            visit: parseInt(row.days_ago) === 0 ? 'Today' :
                parseInt(row.days_ago) === 1 ? 'Yesterday' :
                    `${parseInt(row.days_ago)} days ago`
        }));

        res.status(200).json(formatted);
    } catch (error) {
        console.error('Error fetching recent patients:', error);
        res.status(500).json({ error: 'Failed to fetch recent patients' });
    }
}
