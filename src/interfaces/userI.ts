import mongoose, {Document, Model, Types } from "mongoose";

export interface UserI {
    name: string;
    facebook_id: string;
    photo?: string;
    token: string;
    friends: Types.ObjectId[];
}

export interface UserIwithID {
    name: string;
    facebook_id: string;
    _id: string;
    photo?: string;
    token: string;
    friends: Types.ObjectId[];
}

export interface UserDoc extends Document {
    name: string;
    facebook_id : string;
    _id:string;
    photo?: string;
    token: string;
    friends: Types.ObjectId[];
}

export interface UserModelInterface extends Model<UserDoc> {
    build(attr: UserI): UserDoc;
}
