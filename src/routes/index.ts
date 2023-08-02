import express from 'express';
import passport from 'passport';
import { getSucess, getFailure } from '../controllers/user';
import { getPosts , postPost, getPost, deletePost, updatePost} from '../controllers/posts';
import { getComments, postComment, getComment, deleteComment, updateComment } from '../controllers/comment';



const router = express.Router();

// connects user with facebook
router.get('/login/facebook', passport.authenticate('facebook'));

//Facebook url callback on sucess or failure response
router.get('/auth/callback',  passport.authenticate("facebook", {
    successRedirect: "http://localhost:5173/wall",
    failureRedirect: "/login/failed", 
  }))

// response after sucesfull login
router.get('/sucess', getSucess) 

// response after fail login
router.get("/login/failed", getFailure);

//routes for posts
router.get("/posts", passport.authenticate('facebook'),getPosts)
router.post("/posts",passport.authenticate('facebook'), postPost)
router.get("/posts/:id",passport.authenticate('facebook'), getPost)
router.delete("/posts/:id", passport.authenticate('facebook'), deletePost)
router.put("/posts/:id", passport.authenticate('facebook'), updatePost)

// routes for comments
router.get("/posts/:postId/comments", passport.authenticate('facebook'), getComments)
router.post("/posts/:postId/comments", passport.authenticate('facebook'), postComment)
router.get("/posts/:postId/comments/:commentId", passport.authenticate('facebook'), getComment)
router.delete("/posts/:postId/comments/:commentId", passport.authenticate('facebook'), deleteComment)
router.put("/posts/:postId/comments/:commentId", passport.authenticate('facebook'), updateComment)



export default router;