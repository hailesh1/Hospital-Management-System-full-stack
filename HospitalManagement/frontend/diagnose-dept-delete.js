const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function diagnose() {
    try {
        console.log("--- Checking Departments ---");
        const depts = await pool.query(`
      SELECT d.id, d.name, COUNT(s.id) as staff_count 
      FROM departments d 
      LEFT JOIN staff s ON d.id = s.department_id 
      GROUP BY d.id, d.name
    `);
        console.table(depts.rows);

        const target = depts.rows.find(d => parseInt(d.staff_count) > 0);
        if (target) {
            console.log(`\n--- Testing deletion of department with staff: ${target.name} (${target.id}) ---`);
            try {
                await pool.query('DELETE FROM departments WHERE id = $1', [target.id]);
                console.log("SUCCESS (Wait, this shouldn't happen if there are FK constraints without cascade)");
            } catch (err) {
                console.log("EXPECTED FAILURE:", err.message);
            }
        }

        const emptyTarget = depts.rows.find(d => parseInt(d.staff_count) === 0);
        if (emptyTarget) {
            console.log(`\n--- Testing deletion of empty department: ${emptyTarget.name} (${emptyTarget.id}) ---`);
            try {
                const res = await pool.query('DELETE FROM departments WHERE id = $1 RETURNING id', [emptyTarget.id]);
                if (res.rowCount > 0) {
                    console.log("SUCCESS: Deleted department", emptyTarget.name);
                } else {
                    console.log("FAILURE: Department not found for deletion");
                }
            } catch (err) {
                console.log("UNEXPECTED FAILURE:", err.message);
            }
        }

    } catch (err) {
        console.error("DIAGNOSIS FAILED:", err);
    } finally {
        await pool.end();
    }
}

diagnose();
