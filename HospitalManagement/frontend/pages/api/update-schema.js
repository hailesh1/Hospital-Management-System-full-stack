import { query } from '@/lib/db';

export default async function handler(req, res) {
  try {
    // Add columns to prescriptions
    await query(`ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS medication_name VARCHAR(255)`);
    await query(`ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS appointment_id VARCHAR(255)`);
    await query(`ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS doctor_id VARCHAR(255)`);
    
    // Add columns to lab_tests
    await query(`ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS doctor_id VARCHAR(255)`);
    await query(`ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS appointment_id VARCHAR(255)`);
    await query(`ALTER TABLE lab_tests ADD COLUMN IF NOT EXISTS ordered_by VARCHAR(255)`);
    
    res.status(200).json({ message: 'Schema updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
