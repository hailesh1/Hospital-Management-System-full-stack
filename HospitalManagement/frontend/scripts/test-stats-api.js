const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/dashboard/stats',
    method: 'GET',
};

function hitApi(i) {
    return new Promise((resolve) => {
        const start = Date.now();
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const duration = Date.now() - start;
                console.log(`Request ${i}: Status ${res.statusCode} (${duration}ms)`);
                if (res.statusCode !== 200) {
                    console.error(`Error in request ${i}:`, data);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request ${i}: ${e.message}`);
            resolve();
        });

        req.end();
    });
}

async function runTest() {
    console.log('Starting stress test on /api/dashboard/stats ...');
    // Run 10 sequential requests first to warm up and check correctness
    console.log('--- Sequential Tests ---');
    for (let i = 1; i <= 5; i++) {
        await hitApi(i);
    }

    // Run 20 concurrent requests to test pool limits
    console.log('--- Concurrent Tests ---');
    const promises = [];
    for (let i = 6; i <= 25; i++) {
        promises.push(hitApi(i));
    }
    await Promise.all(promises);
    console.log('Test complete.');
}

runTest();
