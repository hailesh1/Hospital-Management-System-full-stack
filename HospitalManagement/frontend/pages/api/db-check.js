import { query } from '@/lib/db';

export default async function handler(req, res) {
  const { table } = req.query;
  
  try {
    if (table) {
        const result = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = $1
        `, [table]);
        res.status(200).json(result.rows);
    } else {
        const result = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        res.status(200).json(result.rows);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
