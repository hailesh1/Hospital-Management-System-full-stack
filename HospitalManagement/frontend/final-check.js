const http = require('http');

const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/',
    method: 'GET',
    timeout: 30000 // 30s
};

console.log('Fetching http://127.0.0.1:3000/ ...');
const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Received data length:', data.length);
        console.log('Preview:', data.substring(0, 100));
    });
});

req.on('error', (err) => {
    console.error('Request Error:', err.message);
});

req.on('timeout', () => {
    console.warn('Request Timeout');
    req.destroy();
});

req.end();
