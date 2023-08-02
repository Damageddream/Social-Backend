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
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User } from "./models/user.model";
import { UserI } from "./interfaces/userI";
const path = require('path');


dotenv.config();
// create app
const app: Express = express();
const port = process.env.PORT || 3000;

//add static files
app.use('/static', express.static(path.join(__dirname, 'public')))

// add middlewares from libraries
app.use(helmet());
app.use(connectToDb);
app.use(cors({ origin: "http://localhost:5173", credentials: true, }));
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    } 
  })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID as string,
      clientSecret: process.env.FB_SECRET as string,
      callbackURL: "http://localhost:3000/auth/callback",
      profileFields: ['id', 'displayName', 'picture.type(large)', 'email']
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ facebook_id: profile._json.id }).exec();
        if (user) {
          if(user.token !== accessToken){
            user.token = accessToken
            await User.findByIdAndUpdate(user._id, user, {})
          }
          done(null, user);
        } else {
          user = User.build({
            name: profile._json.name,
            facebook_id:profile._json.id,
            photo: profile.photos? profile.photos[0].value : `http://localhost:${port}/static/user.png`,
            token: accessToken,
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
