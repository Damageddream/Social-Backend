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
exports.likePost = exports.getPostsWall = exports.updatePost = exports.deletePost = exports.getPost = exports.postPost = exports.getPosts = void 0;
const post_model_1 = require("../models/post.model");
const mongoose_1 = __importDefault(require("mongoose"));
const comment_model_1 = require("../models/comment.model");
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
        const userRequesting = req.user;
        const post = yield post_model_1.Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "post does not exists" });
        }
        if (post.author.toString() !== userRequesting._id.toString()) {
            return res.status(403).json({ sucess: false, message: "only author can remove post" });
        }
        try {
            const removedPost = post_model_1.Post.findByIdAndRemove(post._id);
            const removedComments = comment_model_1.Comment.deleteMany({ post: post._id });
            yield Promise.all([removedComments, removedPost]);
            return res.status(200).json({ sucess: true, message: "post removed" });
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
        const userRequesting = req.user;
        const post = yield post_model_1.Post.findById(req.params.id);
        if (!post) {
            return res.json({ message: "post does not exists" });
        }
        if (post.author.toString() !== userRequesting._id.toString()) {
            return res.status(403).json({ sucess: false, message: "only author can edit post" });
        }
        try {
            const { title, text, likes, comments } = req.body;
            const likesObjectId = likes.map(like => new mongoose_1.default.Types.ObjectId(like));
            const commentsObjectId = comments.map(comment => new mongoose_1.default.Types.ObjectId(comment));
            // author for testing replace with params or req.author
            const postUpdate = post_model_1.Post.build({
                title,
                text,
                author: userRequesting._id,
                timestamp: new Date(),
                likes: likesObjectId,
                _id: post._id,
                comments: commentsObjectId,
            });
            yield post_model_1.Post.findByIdAndUpdate(post._id, postUpdate);
            return res.status(201).send(post);
        }
        catch (err) {
            next(err);
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
        const posts = yield post_model_1.Post.find({ author: { $in: friendsAndUserPosts } }).populate('author');
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