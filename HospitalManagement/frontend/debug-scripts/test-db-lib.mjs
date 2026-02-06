import { query } from './lib/db.js';

async function test() {
    try {
        console.log('Testing query...');
        const result = await query('SELECT NOW()');
        console.log('Result:', result.rows[0]);
        const depts = await query('SELECT * FROM departments LIMIT 1');
        console.log('Dept:', depts.rows[0]);
    } catch (err) {
        console.error('Error in db lib:', err);
    }
}

test();
