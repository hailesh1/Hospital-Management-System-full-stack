import { query } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // 1. Appointment trends (last 7 days)
        const appointmentTrend = await query(`
            SELECT 
                to_char(d, 'Mon DD') as date,
                COALESCE(count(a.id), 0) as count
            FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day'::interval) d
            LEFT JOIN appointments a ON DATE(a.appointment_date) = d
            GROUP BY d
            ORDER BY d ASC
        `);

        // 2. Revenue trends (last 7 days)
        const revenueTrend = await query(`
            SELECT 
                to_char(d, 'Mon DD') as date,
                COALESCE(SUM(i.total), 0) as amount
            FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day'::interval) d
            LEFT JOIN invoices i ON DATE(i.created_at) = d AND LOWER(i.status) = 'paid'
            GROUP BY d
            ORDER BY d ASC
        `);

        // 3. Department distribution
        // 3. Department distribution - Optimized query
        const deptDistribution = await query(`
            SELECT 
                d.name,
                COUNT(s.id) as count
            FROM departments d
            LEFT JOIN staff s ON d.id = s.department_id AND (s.role ILIKE '%doctor%' OR s.role ILIKE '%specialist%' OR s.role = 'DOCTOR')
            GROUP BY d.name
            HAVING COUNT(s.id) > 0
            ORDER BY count DESC
        `);

        res.status(200).json({
            appointments: appointmentTrend.rows,
            revenue: revenueTrend.rows,
            departments: deptDistribution.rows.map(row => ({
                name: row.name,
                count: parseInt(row.count) // Changed from 'value' to 'count' to match Recharts dataKey
            }))
        });
    } catch (error) {
        console.error('Database error in analytics API:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
