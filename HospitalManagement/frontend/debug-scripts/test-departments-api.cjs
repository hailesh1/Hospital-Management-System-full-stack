const { default: handler } = require('./pages/api/departments/index.js');
const httpMocks = require('node-mocks-http');

async function testApi() {
    console.log('Testing GET /api/departments...');
    const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/departments'
    });
    const res = httpMocks.createResponse();

    try {
        await handler(req, res);
        console.log('Status code:', res.statusCode);
        const data = JSON.parse(res._getData());
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('API Test Error:', err.message);
        console.error(err);
    }
    process.exit();
}

testApi();
