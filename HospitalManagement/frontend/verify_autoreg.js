const { query } = require('./lib/db');

async function verifyAutoRegistration() {
    const testId = `dev-test-registration-${Date.now()}`;
    const testEmail = `test-${Date.now()}@example.com`;
    const firstName = 'Test';
    const lastName = 'AutoReg';

    try {
        console.log('--- Verifying Auto-Registration Sync ---');
        console.log(`Simulating registration for: ${firstName} ${lastName} (${testEmail})`);

        // Simulate the fetch call that auth-context.tsx would make
        const response = await fetch('http://localhost:3000/api/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: testId,
                firstName: firstName,
                lastName: lastName,
                email: testEmail,
                status: 'ACTIVE',
                createdBy: 'VERIFY-SCRIPT'
            })
        });

        if (response.status === 201 || response.status === 200) {
            console.log('✅ API Request successful. Checking database...');

            const dbResult = await query('SELECT * FROM patients WHERE id = $1', [testId]);

            if (dbResult.rows.length > 0) {
                console.log('✅ SUCCESS: Patient found in database!');
                console.table(dbResult.rows);
            } else {
                console.log('❌ FAILURE: Patient NOT found in database.');
            }
        } else {
            const err = await response.json();
            console.log('❌ API Request failed:', response.status, err);
        }

        // Cleanup
        await query('DELETE FROM patients WHERE id = $1', [testId]);
        console.log('Cleanup complete.');

    } catch (err) {
        console.error('Test error:', err);
    }
}

verifyAutoRegistration();
