import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Request, Response, NextFunction } from "express";




const passportFacebook = (req: Request, res: Response, next: NextFunction) => {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_ID as string,
        clientSecret: process.env.FB_SECRET as string,
        callbackURL: "http://localhost:8000/auth/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
      }
    )
  );
};
