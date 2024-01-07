import router from "../routes";
import express from "express";
import { connectDB, dropDB } from "../utils/mongoConfigTesting";
import { describe } from "node:test";
import { User } from "../models/user.model";
import dotenv from "dotenv";
import passport = require("passport");
import {
    Strategy as JWTStrategy,
    ExtractJwt as ExtractJWT,
  } from "passport-jwt";
import { UserI } from "../interfaces/userI";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/", router);
app.use(passport.initialize());
app.use(passport.session());
const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
  };
passport.use(
    new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
      try {
        // Find the user based on the provided token payload
        const user = await User.findById(jwtPayload.user._id);
        if (user) {
          return done(null, user);
        } else {
          // If user is not found, return false to indicate authentication failure
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (user: UserI, done) {
    done(null, user);
  });

const request = require('supertest');

describe("user controller tests", () => {
    let token: string;
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
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("New user was registered");

        const user = await User.findOne({ name: 'TestUser' });
        expect(user).not.toBeNull();
        if(user){
            expect(user.name).toBe('TestUser');
        }

    }),
    it("login test user",  async () => {
        const response = await request(app)
          .post('/users/login')
          .send({ username: 'TestUser', password: 'TestPassword' });
    
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('auth passed');
        expect(response.body).toHaveProperty('token');
        token = response.body.token;
        expect(response.body.user.name).toBe('TestUser');
      }),
      it("get friends of test user",  async () => {
        const response = await request(app)
          .get('/users/friends') 
          .set('Authorization', `Bearer ${token}`);
          if (response.status !== 200) {
            console.log(response.body);
          }
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('friends');
      }),
      it("get users who are not friends of test user",  async () => {
        const response = await request(app)
          .get('/users/nofriends')
          .set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body).toHaveProperty('noFriends');
      });

});
