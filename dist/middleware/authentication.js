"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = require("passport-facebook");
const user_model_1 = require("../models/user.model");
const passportFacebook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.use(new passport_facebook_1.Strategy({
        clientID: process.env.FB_ID,
        clientSecret: process.env.FB_SECRET,
        callbackURL: "http://localhost:3000/auth/callback",
    }, function (accessToken, refreshToken, profile, done) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('hi');
            try {
                let user = yield user_model_1.User.findOne({ facebook_id: profile.id }).exec();
                if (user) {
                    done(null, user);
                    res.json({ user });
                }
                else {
                    user = user_model_1.User.build({
                        name: profile.displayName,
                        facebook_id: profile.id,
                    });
                    yield user.save();
                    done(null, user);
                    res.json({ user });
                }
            }
            catch (err) {
                done(err);
            }
        });
    }));
    passport_1.default.serializeUser(function (user, done) {
        done(null, user);
    });
    passport_1.default.deserializeUser(function (user, done) {
        done(null, user);
    });
});
exports.default = passportFacebook;
//# sourceMappingURL=authentication.js.map