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
exports.postLogout = exports.deleteUser = exports.editUser = exports.postLogin = exports.postRegister = exports.postInvites = exports.getInvites = exports.postInvite = exports.getNoFriends = exports.getFriends = exports.getUsers = exports.getLogout = exports.getFailure = exports.getSucess = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const post_model_1 = require("../models/post.model");
const comment_model_1 = require("../models/comment.model");
const fs_1 = __importDefault(require("fs"));
const path = require("path");
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
const getFriends = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userWithId = req.user;
        const user = yield user_model_1.User.findById(userWithId._id.toString()).populate("friends");
        return res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
});
exports.getFriends = getFriends;
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
        console.log(id, userRequesting._id);
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
        if (userAnswering === null || userAnswering === void 0 ? void 0 : userAnswering.invitesSent.includes(id)) {
            updatedUserRequesting = Object.assign(Object.assign({}, updatedUserRequesting), { $pull: { invitesSent: objectId } });
        }
        if (userTargeted === null || userTargeted === void 0 ? void 0 : userTargeted.invites.includes(userRequesting._id)) {
            updatedUserTargeted = Object.assign(Object.assign({}, updatedUserTargeted), { $pull: { invites: userRequesting._id } });
        }
        try {
            const updatedUser = user_model_1.User.findByIdAndUpdate(userRequesting._id, updatedUserRequesting);
            const updatedFriend = user_model_1.User.findByIdAndUpdate(id, updatedUserTargeted);
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
const postRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    try {
        const user = user_model_1.User.build({
            name,
            password,
            photo: req.file
                ? `http://localhost:3000/static/${req.file.filename}`
                : "http://localhost:3000/static/user.png",
            friends: [],
            invites: [],
            invitesSent: [],
        });
        if (user.password) {
            bcryptjs_1.default.hash(user.password, 10, (err, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    next(err);
                }
                else {
                    user.password = hashedPassword;
                    yield user.save();
                    return res
                        .status(201)
                        .json({ success: true, message: "New user was registered" });
                }
            }));
        }
    }
    catch (err) {
        next(err);
    }
});
exports.postRegister = postRegister;
const postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    let password = req.body.password;
    //const { username, password } = req.body;
    if (username === "Guest") {
        password = "guest987";
    }
    try {
        const user = yield user_model_1.User.findOne({ name: username });
        if (!user) {
            const err = new Error("User does not exists");
            return next(err);
        }
        if (user.password) {
            bcryptjs_1.default.compare(password, user.password, (err, ress) => {
                if (ress) {
                    const secret = process.env.SECRET;
                    const token = jsonwebtoken_1.default.sign({ user }, secret);
                    return res
                        .status(200)
                        .json({ status: "success", message: "auth passed", token, user });
                }
                else {
                    const err = new Error("User does not match");
                    return next(err);
                }
            });
        }
        else {
            const err = new Error("Problem with password");
            return next(err);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.postLogin = postLogin;
const editUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRequesting = req.user;
    const name = req.body.name;
    if (userRequesting.name === "Guest") {
        return res.status(403).json({ sucesss: false, message: "You cannot edit Guest profile" });
    }
    try {
        const user = yield user_model_1.User.findById(req.params.id);
        const secret = process.env.SECRET;
        const token = jsonwebtoken_1.default.sign({ user }, secret);
        if (!user) {
            return res.status(404).json({ sucess: false, message: "user not found" });
        }
        if (user._id.toString() !== userRequesting._id.toString()) {
            return res.status(403).json({
                sucess: false,
                message: "only account owner can edit profile",
            });
        }
        let editedUser;
        if (req.file) {
            editedUser = {
                name,
                photo: `http://localhost:3000/static/${req.file.filename}`,
            };
        }
        else {
            editedUser = { name };
        }
        try {
            yield user_model_1.User.findByIdAndUpdate(user._id, editedUser);
            return res.status(201).json({ sucess: true, message: "edited user" });
        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.editUser = editUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const userRequesting = req.user;
    if (userRequesting.name === "Guest") {
        return res.status(403).json({ sucesss: false, message: "You cannot delete Guest profile" });
    }
    try {
        const user = yield user_model_1.User.findById(id);
        console.log((_a = user === null || user === void 0 ? void 0 : user.photo) === null || _a === void 0 ? void 0 : _a.toString().slice(-8));
        if (!user) {
            return res.status(404).json({ sucess: false, message: "user not found" });
        }
        if (id !== userRequesting._id.toString()) {
            return res
                .status(403)
                .json({ sucess: false, message: "only owner can delete account" });
        }
        try {
            if (user.photo && !user.facebook_id && user.photo.toString().slice(-8) !== 'user.png') {
                const photoPath = path.join(__dirname, "../public", user.photo);
                fs_1.default.unlinkSync(photoPath);
            }
            const removedUser = user_model_1.User.findByIdAndRemove(id);
            const removedPosts = post_model_1.Post.deleteMany({ author: id });
            const removedComments = comment_model_1.Comment.deleteMany({ author: id });
            const updatedFriends = user_model_1.User.updateMany({ friends: id }, { $pull: { friends: id } });
            const updatedInvitesSent = user_model_1.User.updateMany({ invitesSent: id }, { $pull: { invitesSent: id } });
            const updatedInvites = user_model_1.User.updateMany({ invites: id }, { $pull: { invites: id } });
            yield Promise.all([
                removedComments,
                removedPosts,
                removedUser,
                updatedFriends,
                updatedInvites,
                updatedInvitesSent,
            ]);
            return res.status(200).json({ sucess: true, message: "user removed" });
        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUser = deleteUser;
const postLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        return res.status(200).json({ sucess: true, message: "user logout" });
    });
};
exports.postLogout = postLogout;
//# sourceMappingURL=user.js.map