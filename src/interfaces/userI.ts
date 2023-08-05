import mongoose, {Document, Model, Types } from "mongoose";
import { Request } from "express";


export interface UserI {
    name: string;
    facebook_id: string;
    photo?: string;
    friends: Types.ObjectId[];
    invites: Types.ObjectId[];
}

export interface UserIwithID {
    name: string;
    facebook_id: string;
    _id: string;
    photo?: string;
    friends: Types.ObjectId[];
    invites: Types.ObjectId[];
}

export interface UserDoc extends Document {
    name: string;
    facebook_id : string;
    _id:string;
    photo?: string;
    friends: Types.ObjectId[];
    invites: Types.ObjectId[];
}

export interface UserModelInterface extends Model<UserDoc> {
    build(attr: UserI): UserDoc;
}

export interface CustomUser extends Express.User {
    _id: Types.ObjectId
}