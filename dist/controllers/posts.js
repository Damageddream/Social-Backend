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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePost = exports.deletePost = exports.getPost = exports.postPost = exports.getPosts = void 0;
const post_model_1 = require("../models/post.model");
const mongoose_1 = require("mongoose");
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
    try {
        const { title, text } = req.body;
        // author for testing replae with params or req.author
        const post = post_model_1.Post.build({
            title,
            text,
            author: new mongoose_1.Types.ObjectId("64b91a116b03c6637bd49a14"),
            timestamp: new Date(),
            likes: [],
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
                    _id: post._id
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
//# sourceMappingURL=posts.js.map