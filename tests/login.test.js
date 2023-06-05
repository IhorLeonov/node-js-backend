// 1. Res must have status 200.
// 2. Return token.
// 3. Return user: {email: String, subscription: String}

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.DB_HOST);
});

/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.close();
});

const payload = {
    email: 'test@gmail.com',
    password: '123456',
};

describe('POST /users/login', () => {
    it('should login a user,', async () => {
        const result = await request(app)
            .post('/api/users/login')
            .send(payload);

        expect(result.statusCode).toBe(200);
        expect(result.body.token).toBeDefined();
        expect(result.body.user).toBeDefined();
        expect(Object.keys(result.body.user).includes('email')).toBe(true);
        expect(Object.keys(result.body.user).includes('subscription')).toBe(
            true
        );
        expect(typeof result.body.user).toBe('object');
        expect(typeof result.body.user.email).toBe('string');
        expect(typeof result.body.user.subscription).toBe('string');
    });
});
