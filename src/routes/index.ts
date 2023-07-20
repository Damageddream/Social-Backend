import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';



const router = express.Router();

// connects user with facebook
router.get('/login/facebook', passport.authenticate('facebook'));

//Facebook url callback on sucess or failure response
router.get('/auth/callback',  passport.authenticate("facebook", {
    successRedirect: "/sucess",
    failureRedirect: "/login/failed",
  }))

router.get('/sucess', (req: Request, res: Response, next: NextFunction)=>{
    if (req.user) {
        res.status(200).json({
          success: true,
          message: "successfull",
          user: req.user,
          cookies: req.cookies
        });
      }
})

router.get("/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "failure",
    });
  });


export default router;