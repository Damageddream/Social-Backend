import express from "express";
import passport from "passport";
import { getSucess, getFailure, getNoFriends } from "../controllers/user";
import {
  getPosts,
  postPost,
  getPost,
  deletePost,
  updatePost,
} from "../controllers/posts";
import {
  getComments,
  postComment,
  getComment,
  deleteComment,
  updateComment,
} from "../controllers/comment";

const router = express.Router();

// connects user with facebook
router.get("/login/facebook", passport.authenticate("facebook"));

//Facebook url callback on sucess or failure response
router.get(
  "/auth/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:5173/wall",
    failureRedirect: "/login/failed",
  })
);

// response after sucesfull login
router.get("/sucess", getSucess);

// response after fail login
router.get("/login/failed", getFailure);

//routes for posts
router.get("/posts", passport.authenticate("jwt", {session: false}), getPosts);
router.post("/posts",passport.authenticate("jwt", {session: false}), postPost);
router.get("/posts/:id", getPost);
router.delete("/posts/:id", deletePost);
router.put("/posts/:id", updatePost);

// routes for comments
router.get("/posts/:postId/comments", getComments);
router.post("/posts/:postId/comments", postComment);
router.get("/posts/:postId/comments/:commentId", getComment);
router.delete("/posts/:postId/comments/:commentId", deleteComment);
router.put("/posts/:postId/comments/:commentId", updateComment);

//routes for users
router.get("/users")
router.get("/users/nofriends", passport.authenticate("jwt", {session: false}), getNoFriends)

export default router;
