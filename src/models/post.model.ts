import mongoose, { Schema } from "mongoose";
import { PostI, PostDoc, PostModelInteraface } from "../interfaces/postI";

const postSchema = new Schema({
  title: { type: String, required: true, maxLength: 100, minLength: 1 },
  text: { type: String, required: true, maxLength: 500, minLength: 1 },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  timestamp: { type: Date, required: true },
  likes: { type: Array, required: true },
});



postSchema.statics.build = (attr: PostI) => {
  return new Post(attr);
}; 

const Post = mongoose.model<PostDoc, PostModelInteraface>("Post", postSchema);

export { Post };
