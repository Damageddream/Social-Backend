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
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = exports.getPostsWall = exports.updatePost = exports.deletePost = exports.getPost = exports.postPost = exports.getPosts = void 0;
const post_model_1 = require("../models/post.model");
const mongoose_1 = __importStar(require("mongoose"));
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.Post.find();
        return res.status(200).json(posts);
    }
    catch (err) {
        next(err);
    }
});
exports.getPosts = getPosts;
const postPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const { title, text } = req.body;
        const post = post_model_1.Post.build({
            title,
            text,
            author: user._id,
            timestamp: new Date(),
            likes: [],
            comments: [],
        });
        yield post.save();
        return res.status(201).send(post);
    }
    catch (err) {
        next(err);
    }
});
exports.postPost = postPost;
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.Post.findById(req.params.id);
        return res.status(200).json(post);
    }
    catch (err) {
        next(err);
    }
});
exports.getPost = getPost;
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.Post.findById(req.params.id);
        if (!post) {
            return res.json({ message: "post does not exists" });
        }
        try {
            yield post_model_1.Post.findByIdAndRemove(post._id);
            return res.status(200).json({ message: "post removed" });
        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.deletePost = deletePost;
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.Post.findById(req.params.id);
        if (!post) {
            return res.json({ message: "post does not exists" });
        }
        else {
            try {
                const { title, text } = req.body;
                // author for testing replace with params or req.author
                const postUpdate = post_model_1.Post.build({
                    title,
                    text,
                    author: new mongoose_1.Types.ObjectId("64b91a116b03c6637bd49a14"),
                    timestamp: new Date(),
                    likes: [],
                    _id: post._id,
                    comments: [],
                });
                yield post_model_1.Post.findByIdAndUpdate(post._id, postUpdate, {});
                return res.status(201).send(post);
            }
            catch (err) {
                next(err);
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.updatePost = updatePost;
const getPostsWall = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRequesting = req.user;
    const friendsAndUserPosts = [
        ...userRequesting.friends,
        userRequesting._id,
    ];
    try {
        const posts = yield post_model_1.Post.find({ author: { $in: friendsAndUserPosts } });
        console.log(posts);
        return res
            .status(200)
            .json({ success: true, message: "sucesfully fetched posts", posts });
    }
    catch (err) {
        next(err);
    }
});
exports.getPostsWall = getPostsWall;
const likePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRequesting = req.user;
    const userId = new mongoose_1.default.Types.ObjectId(userRequesting._id);
    const id = req.params.id;
    try {
        const post = (yield post_model_1.Post.findById(id));
        if (post.likes.includes(userId)) {
            try {
                yield post_model_1.Post.findByIdAndUpdate(id, { $pull: { likes: userId } });
                return res.status(200).json({ sucess: true, message: "removed like" });
            }
            catch (err) {
                next(err);
            }
        }
        try {
            yield post_model_1.Post.findByIdAndUpdate(id, { $push: { likes: userId } });
            return res.status(200).json({ sucess: true, message: "added like" });
        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.likePost = likePost;
//# sourceMappingURL=posts.js.map