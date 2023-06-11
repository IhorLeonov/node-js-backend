const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const { DB_HOST_TEST, PORT } = process.env;
const { User } = require('../models/user');

describe('auth testing', () => {
    let server = null;

    beforeAll(async () => {
        server = app.listen(PORT);
        await mongoose.connect(DB_HOST_TEST);
    });

    afterAll(async () => {
        server.close();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    test('should register user,', async () => {
        const registerData = {
            name: 'test',
            email: 'test@gmail.com',
            password: '123456',
        };

        const { statusCode, body } = await request(app)
            .post('/api/users/register')
            .send(registerData);

        expect(statusCode).toBe(201);
        expect(body.user.name).toBe(registerData.name);
        expect(body.user.email).toBe(registerData.email);

        const user = await User.findOne({ email: registerData.email });
        expect(user.email).toBe(registerData.email);
    });

    test('should login user,', async () => {
        const loginData = {
            email: 'vejope2488@soremap.com',
            password: '123456',
        };

        const result = await request(app)
            .post('/api/users/login')
            .send(loginData);
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
