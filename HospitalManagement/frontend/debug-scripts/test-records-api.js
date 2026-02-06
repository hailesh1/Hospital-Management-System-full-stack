const { default: handler } = require('./pages/api/medical-records/index.js');
const httpMocks = require('node-mocks-http');

async function testApi() {
    console.log('Testing GET /api/medical-records...');
    const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/medical-records'
    });
    const res = httpMocks.createResponse();

    try {
        await handler(req, res);
        console.log('Status code:', res.statusCode);
        const data = JSON.parse(res._getData());
        console.log('Data count:', data.length);
        if (data.length > 0) {
            console.log('Sample record:', data[0]);
        }
    } catch (err) {
        console.error('API Test Error:', err.message);
    }
    process.exit();
}

testApi();
