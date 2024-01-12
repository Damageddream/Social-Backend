import router from "../routes";
import express from "express";
import { connectDB, dropDB } from "../utils/mongoConfigTesting";
import { describe } from "node:test";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";
import dotenv from "dotenv";
import { User } from "../models/user.model";
import passport = require("passport");
import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
} from "passport-jwt";
import { UserI } from "../interfaces/userI";
import mongoose from "mongoose";


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

const request = require("supertest");

describe("user controller tests", () => {
  let token: string;
  let testUserID: string;
  let testUser2ID: string;
  let postId: string;
  let friendPostId: string;
  beforeAll(async () => {
    await connectDB();
    const user = User.build({
      name: "testUser1",
      password: "testpassword1",
      photo: "http://localhost:3000/static/user.png",
      friends: [],
      invites: [],
      invitesSent: [],
    });
    testUserID = user._id.toString();
    await user.save();
    const friendPost = Post.build({
      text: 'This is a friend post',
      author: new mongoose.Types.ObjectId(testUserID),
      timestamp: new Date(),
      likes: [],
      comments: [],
    });
    await friendPost.save(); 
    friendPostId = friendPost._id.toString();
  });

  afterAll(async () => {
    await dropDB();
  });

  it("register test user", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({ name: "TestUser", password: "TestPassword" });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("New user was registered");

    const user = await User.findOne({ name: "TestUser" });
    expect(user).not.toBeNull();
    if (user) {
      expect(user.name).toBe("TestUser");
    }
  }),
  it("login test user", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({ username: "TestUser", password: "TestPassword" });
    expect(response.status).toBe(200);

    expect(response.body.message).toBe("auth passed");
    expect(response.body.token).not.toBeNull();
    token = response.body.token;
    const user = await User.findOne({ name: 'TestUser' });
    testUser2ID = user?._id.toString() || "";
    // add users as friends for testing only friends posts on wall
    await User.findByIdAndUpdate(testUser2ID, {$push: {friends: testUserID}})
    await User.findByIdAndUpdate(testUserID, {$push: {friends: testUser2ID}})

  }),
  it('should create a post', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'This is a test post' });
    postId = response.body._id;
    expect(response.status).toBe(201);
    expect(response.body.text).toBe('This is a test post');
    expect(response.body.author).toBe(testUser2ID);
  }) })