import { query } from '@/lib/db';
import crypto from 'crypto';

export default async function handler(req, res) {
    try {
        const changes = [];

        // 1. Ensure Administration department exists
        const adminCheck = await query("SELECT * FROM departments WHERE name = $1", ['Administration']);
        if (adminCheck.rows.length === 0) {
            const id = crypto.randomUUID();
            await query("INSERT INTO departments (id, name, description) VALUES ($1, $2, $3)", [id, 'Administration', 'Hospital Administration and Management']);
            changes.push('Added Administration department');
        }

        // 2. Fix Cardiologist -> Cardiology
        const cardioCheck = await query("SELECT * FROM departments WHERE name = $1", ['Cardiologist']);
        if (cardioCheck.rows.length > 0) {
            await query("UPDATE departments SET name = $1 WHERE name = $2", ['Cardiology', 'Cardiologist']);
            changes.push('Renamed Cardiologist to Cardiology');
        }

        // 3. Fix other potential misnomers or add missing standard departments
        const standardDepts = [
            { name: 'General Outpatient', desc: 'General medical services' },
            { name: 'Emergency', desc: 'Emergency medical services' },
            { name: 'Pediatrics', desc: 'Medical care for infants, children, and adolescents' },
            { name: 'Laboratory', desc: 'Pathology and laboratory medicine' },
            { name: 'Pharmacy', desc: 'Pharmaceutical services' }
        ];

        for (const dept of standardDepts) {
            const check = await query("SELECT * FROM departments WHERE name = $1", [dept.name]);
            if (check.rows.length === 0) {
                const id = crypto.randomUUID();
                await query("INSERT INTO departments (id, name, description) VALUES ($1, $2, $3)", [id, dept.name, dept.desc]);
                changes.push(`Added ${dept.name} department`);
            }
        }

        // Return current list
        const allDepts = await query('SELECT * FROM departments ORDER BY name ASC');

        res.status(200).json({
            message: 'Departments seeded/updated successfully',
            changes: changes,
            departments: allDepts.rows
        });
    } catch (error) {
        console.error('Error seeding departments:', error);
        res.status(500).json({ error: error.message });
    }
}
