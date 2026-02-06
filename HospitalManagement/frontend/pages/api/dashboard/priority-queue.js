import { query } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // Fetch critical/emergency appointments or patients in waiting room
        const text = `
      SELECT 
        p.first_name || ' ' || p.last_name as name,
        'Room ' || (FLOOR(RANDOM() * 10 + 1))::text as room, -- Placeholder room allocation
        'Waiting' as status,
        CASE WHEN a.status = 'checked_in' THEN 'critical' ELSE 'high' END as priority, -- Logic placeholder
        EXTRACT(EPOCH FROM (NOW() - a.updated_at))/60 as wait_minutes
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.status = 'checked_in'
      ORDER BY a.updated_at ASC
      LIMIT 5
    `;

        const result = await query(text);

        const queue = result.rows.map(row => ({
            name: row.name,
            room: row.room,
            time: `${Math.round(row.wait_minutes)}m`,
            priority: row.priority
        }));

        res.status(200).json(queue);
    } catch (error) {
        console.error('Error fetching priority queue:', error);
        res.status(500).json({ error: 'Failed to fetch priority queue' });
    }
}
