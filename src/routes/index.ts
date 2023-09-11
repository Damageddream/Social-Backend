import express from "express";
import passport from "passport";
import { getSucess, getFailure, getNoFriends, postInvite, getInvites, postInvites, postRegister, postLogin, getFriends, editUser, deleteUser} from "../controllers/user";
import {
  getPosts,
  postPost,
  getPost,
  deletePost,
  updatePost,
  getPostsWall,
  likePost,
} from "../controllers/posts";
import {
  getComments,
  postComment,
  getComment,
  deleteComment,
  updateComment,
  likeComment,
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
router.get("/wall", passport.authenticate("jwt", {session: false}), getPostsWall)
router.post("/posts/:id/like", passport.authenticate("jwt", {session: false}),likePost)

// routes for comments
router.get("/posts/:postId/comments", passport.authenticate("jwt", {session: false}),getComments);
router.post("/posts/:postId/comments", passport.authenticate("jwt", {session: false}),postComment);
router.get("/comments/:commentId", passport.authenticate("jwt", {session: false}),getComment);
router.delete("/comments/:commentId", passport.authenticate("jwt", {session: false}),deleteComment);
router.put("/comments/:commentId", passport.authenticate("jwt", {session: false}),updateComment);
router.post("/comments/:commentId/like", passport.authenticate("jwt", {session: false}), likeComment)

//routes for users interactions
router.get("/users")
router.get("/users/friends", passport.authenticate("jwt",{session: false}), getFriends)
router.get("/users/nofriends", passport.authenticate("jwt", {session: false}), getNoFriends)
router.post("/users/nofriends", passport.authenticate("jwt", {session: false}), postInvite)
router.get("/users/invites", passport.authenticate("jwt", {session: false}), getInvites)
router.post("/users/invites", passport.authenticate("jwt", {session: false}), postInvites)
router.post("/users/register", upload.single("file"),postRegister)
router.post("/users/login", postLogin)
router.put("/user/edit/:id", passport.authenticate("jwt",{session: false}), upload.single("file"), editUser)
router.delete("/user/delete/:id",passport.authenticate("jwt",{session: false}),deleteUser )
export default router;
