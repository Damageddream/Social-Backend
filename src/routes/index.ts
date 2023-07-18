import express from 'express';
import passport from 'passport';
import {authenticate} from '../controllers/user'


const router = express.Router();

// connects user with facebook
router.get('/login/facebook', passport.authenticate('facebook'));

//Facebook url callback on sucess or failure response
router.get('/auth/callback', passport.authenticate('facebook'), authenticate)


export default router;