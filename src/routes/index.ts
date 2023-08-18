import express from "express";
import passport from "passport";
import { getSucess, getFailure, getNoFriends, postInvite, getInvites, postInvites, postRegister, postLogin, getFriends} from "../controllers/user";
import {
  getPosts,
  postPost,
  getPost,
  deletePost,
  updatePost,
  getPostsWall,
} from "../controllers/posts";
import {
  getComments,
  postComment,
  getComment,
  deleteComment,
  updateComment,
} from "../controllers/comment";
import multer from "multer";
const path = require('path');

const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    const uploadDirectory = path.join(__dirname, '../public')
    cb(null,uploadDirectory)
  },
  filename:(req,file,cb) => {
    const uniqueSuffix = Date.now()+"-"+Math.round(Math.random()*1E9)
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname+"-"+uniqueSuffix+ext)
  }
})

const router = express.Router();
const upload = multer({ storage: storage})

// connects user with facebook
router.get("/login/facebook", passport.authenticate("facebook"));

//Facebook url callback on sucess or failure response
router.get(
  "/auth/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:5173/loginFacebook",
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
router.get("/posts/:id", passport.authenticate("jwt", {session: false}),getPost);
router.delete("/posts/:id", passport.authenticate("jwt", {session: false}),deletePost);
router.put("/posts/:id", passport.authenticate("jwt", {session: false}),updatePost);
router.get("/posts/wall", passport.authenticate("jwt", {session: false}), getPostsWall)

// routes for comments
router.get("/posts/:postId/comments", passport.authenticate("jwt", {session: false}),getComments);
router.post("/posts/:postId/comments", passport.authenticate("jwt", {session: false}),postComment);
router.get("/posts/:postId/comments/:commentId", passport.authenticate("jwt", {session: false}),getComment);
router.delete("/posts/:postId/comments/:commentId", passport.authenticate("jwt", {session: false}),deleteComment);
router.put("/posts/:postId/comments/:commentId", passport.authenticate("jwt", {session: false}),updateComment);

//routes for users interactions
router.get("/users")
router.get("/users/friends", passport.authenticate("jwt",{session: false}), getFriends)
router.get("/users/nofriends", passport.authenticate("jwt", {session: false}), getNoFriends)
router.post("/users/nofriends", passport.authenticate("jwt", {session: false}), postInvite)
router.get("/users/invites", passport.authenticate("jwt", {session: false}), getInvites)
router.post("/users/invites", passport.authenticate("jwt", {session: false}), postInvites)
router.post("/users/register", upload.single("file"),postRegister)
router.post("/users/login", postLogin)
export default router;
