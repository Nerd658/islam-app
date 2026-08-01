const request = require('supertest');
const app = require('./app');

describe('Backend API Tests', () => {
    it('should return 400 if city or country is missing for prayer times', async () => {
        const res = await request(app).get('/prayer-times');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 for chat if message is missing', async () => {
        const res = await request(app).post('/api/chat').send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Validation failed');
    });
});
