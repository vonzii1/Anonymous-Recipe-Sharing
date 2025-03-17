const request = require('supertest');
const app = require('../server'); // Import your Express app

describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
        const res = await request(app).get('/nonexistent');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBeDefined();
    });

    it('should return 500 for server errors', async () => {
        const res = await request(app).get('/error'); // Assume this route throws an error
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});