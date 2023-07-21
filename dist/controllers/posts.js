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
exports.postPost = exports.getPosts = void 0;
const post_model_1 = require("../models/post.model");
const mongoose_1 = require("mongoose");
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.Post.find();
        res.status(200).json(posts);
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
        const post = post_model_1.Post.build({ title, text, author: new mongoose_1.Types.ObjectId("64b91a116b03c6637bd49a14"), timestamp: new Date(), likes: [] });
        yield post.save();
        return res.status(201).send(post);
    }
    catch (err) {
        next(err);
    }
});
exports.postPost = postPost;
//# sourceMappingURL=posts.js.map