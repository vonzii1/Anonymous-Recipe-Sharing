const request = require('supertest');
const app = require('../server'); // Import your Express app

describe('Security Headers', () => {
    it('should have CSP headers', async () => {
        const res = await request(app).get('/');
        expect(res.headers['content-security-policy']).toBeDefined();
    });

    it('should have XSS protection headers', async () => {
        const res = await request(app).get('/');
        expect(res.headers['x-xss-protection']).toBeDefined();
    });
});

describe('User Authentication', () => {
    it('should log in with Google OAuth', async () => {
      const res = await request(app).get('/auth/google');
      expect(res.statusCode).toEqual(302); // Redirect to Google OAuth
    });
  });