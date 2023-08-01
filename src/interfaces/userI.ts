import mongoose, {Document, Model } from "mongoose";

export interface UserI {
    name: string;
    facebook_id: string;
    photo?: string;
}

export interface UserIwithID {
    name: string;
    facebook_id: string;
    _id: string;
    photo?: string;
}

export interface UserDoc extends Document {
    name: string;
    facebook_id : string;
    _id:string;
    photo?: string;
}

export interface UserModelInterface extends Model<UserDoc> {
    build(attr: UserI): UserDoc;
}
