import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
