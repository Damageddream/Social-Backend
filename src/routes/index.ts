import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { getSucess, getFailure } from '../controllers/user';



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


export default router;