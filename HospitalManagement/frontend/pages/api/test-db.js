import { query } from '@/lib/db';

export default async function handler(req, res) {
    try {
        const result = await query('SELECT NOW()');
        res.status(200).json({ success: true, time: result.rows[0].now });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
