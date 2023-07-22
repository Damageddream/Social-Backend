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
exports.updateComment = exports.deleteComment = exports.getComment = exports.postComment = exports.getComments = void 0;
const comment_model_1 = require("../models/comment.model");
const mongoose_1 = require("mongoose");
const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield comment_model_1.Comment.find({ post: req.params.postId });
        return res.status(200).json(comment);
    }
    catch (err) {
        next(err);
    }
});
exports.getComments = getComments;
const postComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const text = req.body.text;
        const comment = comment_model_1.Comment.build({
            text,
            author: new mongoose_1.Types.ObjectId("64b91a116b03c6637bd49a14"),
            timestamp: new Date(),
            likes: [],
            post: new mongoose_1.Types.ObjectId(req.params.postId),
        });
        yield comment.save();
        return res.status(201).send(comment);
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
        const comment = yield comment_model_1.Comment.findById(req.params.commentId);
        if (!comment) {
            return res.json({ message: "comment does not exists" });
        }
        else {
            try {
                yield comment_model_1.Comment.findByIdAndRemove(comment._id);
                return res.status(200).json({ message: "comment removed" });
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
exports.deleteComment = deleteComment;
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield comment_model_1.Comment.findById(req.params.commentId);
        if (!comment) {
            return res.json({ message: "comment does not exists" });
        }
        else {
            try {
                const text = req.body.text;
                const commentUpdate = comment_model_1.Comment.build({
                    text,
                    author: new mongoose_1.Types.ObjectId("64b91a116b03c6637bd49a14"),
                    timestamp: new Date(),
                    likes: [],
                    post: new mongoose_1.Types.ObjectId(req.params.postId),
                    _id: comment._id,
                });
                yield comment_model_1.Comment.findByIdAndUpdate(comment._id, commentUpdate, {});
                return res.status(201).send(commentUpdate);
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
exports.updateComment = updateComment;
//# sourceMappingURL=comment.js.map