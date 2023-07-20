import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import bodyParser, { json } from "body-parser";
import cors from "cors";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler";
import notFound from "./middleware/notFound";
import connectToDb from "./middleware/database";
import dotenv from "dotenv";
import passport from 'passport'
import router from "./routes";
import passportFacebook from "./middleware/authentication";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User } from "./models/user.model";
import { UserI } from "./interfaces/userI";


dotenv.config();
// create app
const app: Express = express();
const port = process.env.PORT || 3000;

// add middlewares from libraries
app.use(helmet());
app.use(connectToDb);
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false, 
  })
);


app.use(passport.initialize());
app.use(passport.session());
//app.use(passportFacebook)
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID as string,
      clientSecret: process.env.FB_SECRET as string,
      callbackURL: "http://localhost:3000/auth/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ facebook_id: profile._json.id }).exec();

        if (user) {
          done(null, user);
        } else {

          user = User.build({
            name: profile._json.name,
            facebook_id:profile._json.id,
          });

          await user.save();
          done(null, user);
        }
      } catch (err) {
        done(err);
      }
    }
  )
);

  passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user: UserI, done) {
  done(null, user);
});
// add parsing
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(json());

app.use('/', router);



// add error handiling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running at at http://localhost:${port}`);
});
