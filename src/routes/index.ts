import express from 'express';
import passport from 'passport';
import { getSucess, getFailure } from '../controllers/user';
import { getPosts } from '../controllers/posts';
import { postPost } from '../controllers/posts';



const router = express.Router();

// connects user with facebook
router.get('/login/facebook', passport.authenticate('facebook'));

//Facebook url callback on sucess or failure response
router.get('/auth/callback',  passport.authenticate("facebook", {
    successRedirect: "/sucess",
    failureRedirect: "/login/failed",
  }))

// response after sucesfull login
router.get('/sucess', getSucess)

// response after fail login
router.get("/login/failed", getFailure);

//routes for posts
router.get("/posts", getPosts)
router.post("/posts", postPost)
router.get("/posts/:id")
router.delete("/posts/:id")
router.put("/posts/:id")

// routes for comments
router.get("posts/:id/comments")
router.post("posts/:id/comments")
router.get("posts/:postId/comments/:commentId")
router.delete("posts/:postId/comments/:commentId")
router.put("posts/:postId/comments/:commentId")



export default router;