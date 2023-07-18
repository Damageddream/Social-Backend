import mongoose, {Document, Model } from "mongoose";

export interface UserI {
    name: string;
    facebook_id: string;
}

export interface UserIwithID {
    name: string;
    facebook_id: string;
    _id: string;
}

export interface UserDoc extends Document {
    name: string;
    facebook_id : string;
    _id:string;
}

export interface UserModelInterface extends Model<UserDoc> {
    build(attr: UserI): UserDoc;
}
