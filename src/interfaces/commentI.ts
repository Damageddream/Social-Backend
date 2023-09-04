import mongoose, {Document, Model, Types } from "mongoose";

export interface CommentI {
    text: string;
    author: Types.ObjectId;
    timestamp: Date;
    likes: Types.ObjectId[];
    post: Types.ObjectId;
    _id?: string;
}   

export interface CommentIwithID {
    text: string;
    author: Types.ObjectId;
    timestamp: Date;
    likes: Types.ObjectId[];
    post: Types.ObjectId;
    _id: string;
}

export interface CommentDoc extends Document {
    text: string;
    author:Types.ObjectId;
    timestamp: Date;
    likes: Types.ObjectId[];
    post: Types.ObjectId;
    _id: string;
}

export interface CommentModelInteraface extends Model<CommentDoc> {
    build(attr: CommentI): CommentDoc;
}