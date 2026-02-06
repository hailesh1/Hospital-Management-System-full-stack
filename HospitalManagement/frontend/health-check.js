const http = require('http');

const endpoints = [
    '/api/patients',
    '/api/staff',
    '/api/dashboard/stats'
];

async function checkEndpoint(path) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            console.log(`Endpoint: ${path} - Status: ${res.statusCode}`);
            resolve(res.statusCode === 200);
        });

        req.on('error', (err) => {
            console.log(`Endpoint: ${path} - Error: ${err.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log(`Endpoint: ${path} - Timeout`);
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

async function runChecks() {
    console.log('Running health checks on localhost:3000...');
    for (const endpoint of endpoints) {
        await checkEndpoint(endpoint);
    }
}

runChecks();
