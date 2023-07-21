import { Request, Response, NextFunction } from "express";
import { Post } from "../models/post.model";
import { Types } from "mongoose";

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (err: Error | any) {
        next(err)
    }
}

export const postPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title, text} = req.body as {title: string, text: string}
        // author for testing replae with params or req.author
        const post = Post.build({title, text, author: new Types.ObjectId("64b91a116b03c6637bd49a14"), timestamp: new Date(), likes: []} )
        await post.save()
        return res.status(201).send(post)

    } catch(err: Error | any) {
        next(err)
    }
}   
