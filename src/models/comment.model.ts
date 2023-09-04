import mongoose, { Schema } from "mongoose";
import {
  CommentI,
  CommentDoc,
  CommentModelInteraface,
} from "../interfaces/commentI";

const commentSchema = new Schema({
  text: { type: String, required: true, maxLength: 500, minLength: 1 },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  timestamp: { type: Date, required: true },
  likes: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
  post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
});

commentSchema.statics.build = (attr: CommentI) => {
  return new Comment(attr);
};

const Comment = mongoose.model<CommentDoc, CommentModelInteraface>(
  "Comment",
  commentSchema
);

export { Comment };
