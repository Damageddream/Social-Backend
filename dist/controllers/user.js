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
exports.postInvites = exports.getInvites = exports.postInvite = exports.getNoFriends = exports.getUsers = exports.getLogout = exports.getFailure = exports.getSucess = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
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
            const friends = [];
            user === null || user === void 0 ? void 0 : user.friends.forEach((friend) => {
                friends.push(friend.toString());
            });
            user === null || user === void 0 ? void 0 : user.invitesSent.forEach((friend) => {
                friends.push(friend.toString());
            });
            friends.push(userWithId._id.toString());
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
        const userRequesting = req.user;
        const { id } = req.body;
        const objectId = new mongoose_1.default.Types.ObjectId(id);
        // const [user, friend] = await Promise.all([
        //   await User.findById(userRequesting._id.toString()),
        //   await User.findById(id)
        // ])
        const user = yield user_model_1.User.findById(userRequesting._id.toString());
        if (user === null || user === void 0 ? void 0 : user.friends.includes(objectId)) {
            return res.status(409).json({ message: "you are already friends" });
        }
        if (user === null || user === void 0 ? void 0 : user.invitesSent.includes(objectId)) {
            return res
                .status(409)
                .json({ message: "you are already sent request to that user" });
        }
        const updatedUser = { $push: { invitesSent: objectId } };
        const updatedFriend = { $push: { invites: userRequesting._id } };
        try {
            yield user_model_1.User.findByIdAndUpdate(userRequesting._id.toString(), updatedUser, {});
            yield user_model_1.User.findByIdAndUpdate(id, updatedFriend, {});
            return res.status(200).json({
                sucess: true,
                message: "invite send sucessfully",
            });
        }
        catch (err) {
            next(err);
        }
        return res.status(200).json({
            sucess: true,
            message: "invite send sucessfully",
        });
    }
    catch (err) {
        next(err);
    }
});
exports.postInvite = postInvite;
const getInvites = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const userWithInvites = yield user_model_1.User.findById(user._id).populate("invites");
        res.status(200).json(userWithInvites);
    }
    catch (err) {
        next(err);
    }
});
exports.getInvites = getInvites;
const postInvites = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, answer } = req.body;
        const userRequesting = req.user;
        const objectId = new mongoose_1.default.Types.ObjectId(id);
        const [userAnswering, userTargeted] = yield Promise.all([
            user_model_1.User.findById(userRequesting._id),
            user_model_1.User.findById(id),
        ]);
        // check if users are not already friends and return if they are
        if (userAnswering === null || userAnswering === void 0 ? void 0 : userAnswering.friends.includes(objectId)) {
            return res.status(409).json({ message: "you already are friends" });
        }
        if (userTargeted === null || userTargeted === void 0 ? void 0 : userTargeted.friends.includes(userRequesting._id)) {
            return res.status(409).json({ message: "you already are friends" });
        }
        // if invite accepted, add users to friends and remove from invites
        let updatedUserRequesting;
        let updatedUserTargeted;
        if (answer === "accept") {
            updatedUserRequesting = {
                $push: { friends: objectId },
                $pull: { invites: objectId },
            };
            updatedUserTargeted = {
                $push: { friends: userRequesting._id },
                $pull: { invitesSent: userRequesting._id },
            };
        }
        else if (answer === "denie") {
            updatedUserRequesting = { $pull: { invites: objectId } };
            updatedUserTargeted = { $pull: { invitesSent: userRequesting._id } };
        }
        if (userAnswering === null || userAnswering === void 0 ? void 0 : userAnswering.invitesSent.includes(objectId)) {
            updatedUserRequesting = Object.assign(Object.assign({}, updatedUserRequesting), { $pull: { invitesSent: objectId } });
        }
        if (userTargeted === null || userTargeted === void 0 ? void 0 : userTargeted.invites.includes(userRequesting._id)) {
            updatedUserTargeted = Object.assign(Object.assign({}, updatedUserTargeted), { $pull: { invites: userRequesting._id } });
        }
        try {
            const updatedUser = user_model_1.User.findByIdAndUpdate(userRequesting._id, updatedUserRequesting, {});
            const updatedFriend = user_model_1.User.findByIdAndUpdate(objectId, updatedUserTargeted, {});
            yield Promise.all([updatedUser, updatedFriend]);
        }
        catch (err) {
            next(err);
        }
        return res
            .status(200)
            .json({ sucess: true, message: "invite was handle correctly" });
    }
    catch (err) {
        next(err);
    }
});
exports.postInvites = postInvites;
//# sourceMappingURL=user.js.map