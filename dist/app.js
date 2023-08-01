"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const database_1 = __importDefault(require("./middleware/database"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const routes_1 = __importDefault(require("./routes"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_facebook_1 = require("passport-facebook");
const user_model_1 = require("./models/user.model");
const path = require('path');
dotenv_1.default.config();
// create app
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
//add static files
app.use('/static', express_1.default.static(path.join(__dirname, 'public')));
// add middlewares from libraries
app.use((0, helmet_1.default)());
app.use(database_1.default);
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true, }));
app.use((0, morgan_1.default)("dev"));
app.use((0, express_session_1.default)({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: "http://localhost:3000/auth/callback",
    profileFields: ['id', 'displayName', 'picture.type(large)', 'email']
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield user_model_1.User.findOne({ facebook_id: profile._json.id }).exec();
            if (user) {
                done(null, user);
            }
            else {
                user = user_model_1.User.build({
                    name: profile._json.name,
                    facebook_id: profile._json.id,
                    photo: profile.photos ? profile.photos[0].value : `http://localhost:${port}/static/user.png`
                });
                yield user.save();
                done(null, user);
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
// add parsing
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, body_parser_1.json)());
app.use('/', routes_1.default);
// add error handiling
app.use(notFound_1.default);
app.use(errorHandler_1.default);
app.listen(port, () => {
    console.log(`server is running at at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map