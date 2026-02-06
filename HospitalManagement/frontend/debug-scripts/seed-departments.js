const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function seedDepartments() {
    try {
        console.log('Seeding departments...');

        const departments = [
            { name: 'Cardiology', description: 'Heart and cardiovascular system care' },
            { name: 'Neurology', description: 'Brain and nervous system care' },
            { name: 'Pediatrics', description: 'Infant, child, and adolescent care' },
            { name: 'Surgery', description: 'Surgical procedures and perioperative care' },
            { name: 'Internal Medicine', description: 'General adult medical care' },
            { name: 'Emergency', description: 'Urgent and critical care' },
            { name: 'Reception', description: 'Patient reception and registration' },
            { name: 'Administration', description: 'Hospital administration and management' }
        ];

        for (const dept of departments) {
            // Check if department exists
            const check = await pool.query('SELECT id FROM departments WHERE name = $1', [dept.name]);
            if (check.rows.length === 0) {
                console.log(`Adding department: ${dept.name}`);
                await pool.query(
                    'INSERT INTO departments (id, name, description) VALUES (uuid_generate_v4(), $1, $2)',
                    [dept.name, dept.description]
                );
            } else {
                console.log(`Department already exists: ${dept.name}`);
            }
        }

        console.log('Seeding complete.');
    } catch (err) {
        console.error('Error seeding departments:', err.message);
    } finally {
        await pool.end();
    }
}

seedDepartments();
