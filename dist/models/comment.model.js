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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const commentSchema = new mongoose_1.Schema({
    text: { type: String, required: true, maxLength: 500, minLength: 1 },
    author: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    timestamp: { type: Date, required: true },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" }],
    post: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Post" },
});
commentSchema.statics.build = (attr) => {
    return new Comment(attr);
};
const Comment = mongoose_1.default.model("Comment", commentSchema);
exports.Comment = Comment;
//# sourceMappingURL=comment.model.js.map