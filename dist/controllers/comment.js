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
exports.likeComment = exports.updateComment = exports.deleteComment = exports.getComment = exports.postComment = exports.getComments = void 0;
const comment_model_1 = require("../models/comment.model");
const mongoose_1 = __importStar(require("mongoose"));
const post_model_1 = require("../models/post.model");
const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.Post.findById(req.params.postId).populate('comments').populate({ path: 'comments', populate: { path: 'author', model: "User" } }).populate('author');
        return res.status(200).json(post);
    }
    catch (err) {
        next(err);
    }
});
exports.getComments = getComments;
const postComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.body.post;
        const text = req.body.text;
        const user = req.user;
        const comment = comment_model_1.Comment.build({
            text,
            author: user._id,
            timestamp: new Date(),
            likes: [],
            post: new mongoose_1.Types.ObjectId(req.params.postId),
        });
        const addedComment = yield comment.save();
        const newCommentId = addedComment._id;
        yield post_model_1.Post.findByIdAndUpdate(postId, { $push: { comments: newCommentId } });
        return res.status(201).json({ success: true, message: "New comment added" });
    }
    catch (err) {
        next(err);
    }
});
exports.postComment = postComment;
const getComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield comment_model_1.Comment.findById(req.params.commentId);
        return res.status(200).json(comment);
    }
    catch (err) {
        next(err);
    }
});
exports.getComment = getComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRequesting = req.user;
        const comment = yield comment_model_1.Comment.findById(req.params.commentId);
        if (!comment) {
            return res.json({ message: "comment does not exists" });
        }
        if (comment.author.toString() !== userRequesting._id.toString()) {
            return res.status(403).json({ sucess: false, message: "only author can remove comment" });
        }
        try {
            yield comment_model_1.Comment.findByIdAndRemove(comment._id);
            return res.status(200).json({ message: "comment removed" });
        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.deleteComment = deleteComment;
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRequesting = req.user;
        const comment = yield comment_model_1.Comment.findById(req.params.commentId);
        if (!comment) {
            return res.json({ message: "comment does not exists" });
        }
        if (comment.author.toString() !== userRequesting._id.toString()) {
            return res.status(403).json({ sucess: false, message: "only author can edit comment" });
        }
        try {
            const text = req.body.text;
            const postId = req.body.post;
            const likes = req.body.likes;
            const likesObjectId = likes.map(like => new mongoose_1.default.Types.ObjectId(like));
            const commentUpdate = comment_model_1.Comment.build({
                text,
                author: userRequesting._id,
                timestamp: new Date(),
                likes: likesObjectId,
                post: postId,
                _id: comment._id,
            });
            yield comment_model_1.Comment.findByIdAndUpdate(comment._id, commentUpdate);
            return res.status(201).send(commentUpdate);
        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.updateComment = updateComment;
const likeComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRequesting = req.user;
    const userId = new mongoose_1.default.Types.ObjectId(userRequesting._id);
    const id = req.params.commentId;
    try {
        const comment = (yield comment_model_1.Comment.findById(id));
        if (comment.likes.includes(userId)) {
            try {
                yield comment_model_1.Comment.findByIdAndUpdate(id, { $pull: { likes: userId } });
                return res.status(200).json({ sucess: true, message: "removed like" });
            }
            catch (err) {
                next(err);
            }
        }
        try {
            yield comment_model_1.Comment.findByIdAndUpdate(id, { $push: { likes: userId } });
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
exports.likeComment = likeComment;
//# sourceMappingURL=comment.js.map