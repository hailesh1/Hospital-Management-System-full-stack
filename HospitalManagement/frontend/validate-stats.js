const http = require('http');

http.get('http://localhost:3000/api/dashboard/stats', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const stats = JSON.parse(data);
            console.log('--- DASHBOARD STATS ---');
            console.log('Appointments Today:', stats.appointmentsToday);
            console.log('Doctors:', stats.doctors);
            console.log('Nurses:', stats.nurses);
            console.log('Admin:', stats.admin);
            console.log('Support:', stats.support);
            console.log('Total Staff:', stats.staff);
            console.log('-----------------------');
        } catch (e) {
            console.error('Failed to parse response:', data);
        }
        process.exit();
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
    process.exit();
});
