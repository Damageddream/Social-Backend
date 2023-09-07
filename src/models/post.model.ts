import mongoose, { Schema } from "mongoose";
import { PostI, PostDoc, PostModelInteraface } from "../interfaces/postI";
import { Comment } from "./comment.model";
import { NextFunction } from "express";

export const postSchema = new Schema({
  title: { type: String, required: true, maxLength: 100, minLength: 1 },
  text: { type: String, required: true, maxLength: 500, minLength: 1 },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  timestamp: { type: Date, required: true },
  likes: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
  comments: [{type: Schema.Types.ObjectId, required: true, ref: "Comment"}]
  
});



postSchema.statics.build = (attr: PostI) => {
  return new Post(attr);
}; 

const Post = mongoose.model<PostDoc, PostModelInteraface>("Post", postSchema);

export { Post };
