import router from "../routes";
import express from "express";
import { connectDB, dropDB } from "../utils/mongoConfigTesting";
import { describe } from "node:test";
import { User } from "../models/user.model";


const app = express();
app.use(express.json());
app.use("/", router);

const request = require('supertest');

describe("user controller tests", () => {

    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await dropDB();
    });

    it("register test user",  async () => {
        const response = await request(app)
        .post('/users/register')
        .send({ name: 'TestUser', password: 'TestPassword' });
        expect(response.status).toBe(201);
    });

});
