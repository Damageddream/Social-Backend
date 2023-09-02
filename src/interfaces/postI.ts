import mongoose, {Document, Model, Types } from "mongoose";

export interface PostI {
    title: string;
    text: string;
    author: Types.ObjectId;
    timestamp: Date;
    likes: string[];
    _id?: string;
    comments: Types.ObjectId[];
}

export interface PostIwithID {
    title: string;
    text: string;
    author: Types.ObjectId;
    timestamp: Date;
    likes: string[];
    _id: string;
    comments: Types.ObjectId[];
}

export interface PostDoc extends Document {
    title: string;
    text: string;
    author: Types.ObjectId;
    timestamp: Date;
    likes: string[];
    _id: string;
    comments: Types.ObjectId[];
}

export interface PostModelInteraface extends Model<PostDoc> {
    build(attr: PostI): PostDoc;
} 