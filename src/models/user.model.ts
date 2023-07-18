import mongoose, { Schema } from "mongoose";
import { UserI, UserDoc, UserModelInterface } from "../interfaces/userI";



const userSchema = new Schema({
    name: {type: String, required: true},
    facebook_id: {type: String, required: true}
})

const User = mongoose.model<UserDoc, UserModelInterface> (
    "User", userSchema
)


userSchema.statics.build = (attr: UserI) => {
    return new User(attr)
}


export { User }