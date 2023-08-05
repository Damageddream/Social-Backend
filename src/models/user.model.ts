import mongoose, { Schema } from "mongoose";
import { UserI, UserDoc, UserModelInterface } from "../interfaces/userI";



const userSchema = new Schema({
    name: {type: String, required: true},
    facebook_id: {type: String, required: true},
    photo: {type: String},
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    invites: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
})


userSchema.statics.build = (attr: UserI) => {
    return new User(attr)
}

const User = mongoose.model<UserDoc, UserModelInterface> (
    "User", 
    userSchema
)


export { User }