import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { UserDoc, UserI } from "../interfaces/userI";

const passportFacebook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user: UserI, done) {
    done(null, user);
  });

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_ID as string,
        clientSecret: process.env.FB_SECRET as string,
        callbackURL: "http://localhost:3000/auth/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          let user = await User.findOne({ facebook_id: profile.id }).exec();

          if (user) {
            done(null, user);
            res.json({user});
          } else {
            user = User.build({
              name: profile.displayName,
              facebook_id: profile.id,
            });

            await user.save();
            done(null, user);
            res.json({user})
          }
        } catch (err) {
          done(err);
        }
      }
    )
  );
};

export default passportFacebook;
