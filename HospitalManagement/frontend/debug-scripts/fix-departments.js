const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: '127.0.0.1',
    database: process.env.DB_NAME || 'hospital_management',
    password: '1234',
    port: process.env.DB_PORT || 5432,
});

async function checkAndAddDepartments() {
    try {
        console.log('Checking departments...');
        const res = await pool.query('SELECT * FROM departments');
        console.log('Current departments:', res.rows.map(d => d.name));

        const requiredDepts = ['Reception', 'Administration'];
        const existingNames = res.rows.map(d => d.name);

        for (const dept of requiredDepts) {
            if (!existingNames.includes(dept)) {
                console.log(`Adding missing department: ${dept}`);
                await pool.query('INSERT INTO departments (id, name, description) VALUES (uuid_generate_v4(), $1, $2)', [dept, `${dept} Department`]);
            }
        }

        console.log('Done.');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkAndAddDepartments();
