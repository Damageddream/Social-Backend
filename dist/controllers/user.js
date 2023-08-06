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
exports.postInvite = exports.getNoFriends = exports.getUsers = exports.getLogout = exports.getFailure = exports.getSucess = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// sucesfull login response
const getSucess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        const userRequest = req.user;
        try {
            const user = yield user_model_1.User.findById(req.user);
            const secret = process.env.SECRET;
            const token = jsonwebtoken_1.default.sign({ user }, secret);
            return res.status(200).json({
                success: true,
                message: "successfull",
                user,
                token,
            });
        }
        catch (err) {
            next(err);
        }
    }
    else {
        res.status(401).json({
            message: "problem with authentication",
        });
    }
});
exports.getSucess = getSucess;
// failure login reponse
const getFailure = (req, res, next) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
};
exports.getFailure = getFailure;
const getLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect(process.env.CLIENT_URL);
    });
};
exports.getLogout = getLogout;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find();
        return res.status(200).json(users);
    }
    catch (err) {
        next(err);
    }
});
exports.getUsers = getUsers;
const getNoFriends = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const userWithId = req.user;
            const user = yield user_model_1.User.findById(userWithId._id.toString());
            // array of friends of user
            // !! map to change object id into string id when adding freind will be added
            // !! also add req.user id to that array
            const friends = user === null || user === void 0 ? void 0 : user.friends.map((friend) => {
                return friend.toString();
            });
            if (friends) {
                friends.push(userWithId._id.toString());
            }
            // array of all users there are no friends with user
            const noFriends = yield user_model_1.User.find({ _id: { $nin: friends } });
            return res.status(200).json({
                success: true,
                noFriends,
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "request must be send by user",
            });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.getNoFriends = getNoFriends;
const postInvite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({
            message: "success",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.postInvite = postInvite;
//# sourceMappingURL=user.js.map