import mongoose, {Document, Model, Types } from "mongoose";

export interface PostI {
    text: string;
    author: Types.ObjectId;
    timestamp: Date;
    likes: Types.ObjectId[];
    _id?: string;
    comments: Types.ObjectId[];
}

export interface PostIwithID {
    text: string;
    author: Types.ObjectId;
    timestamp: Date;
    likes: Types.ObjectId[];
    _id: string;
    comments: Types.ObjectId[];
}

export interface PostDoc extends Document {
    text: string;
    author: Types.ObjectId;
    timestamp: Date;
    likes: Types.ObjectId[];
    _id: string;
    comments: Types.ObjectId[];
}

export interface PostModelInteraface extends Model<PostDoc> {
    build(attr: PostI): PostDoc;
} 