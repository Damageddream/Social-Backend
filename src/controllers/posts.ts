import { Request, Response, NextFunction } from "express";
import { Post } from "../models/post.model";
import { Types } from "mongoose";

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (err: Error | any) {
    next(err);
  }
};

export const postPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, text } = req.body as { title: string; text: string };
    // author for testing replae with params or req.author
    const post = Post.build({
      title,
      text,
      author: new Types.ObjectId("64b91a116b03c6637bd49a14"),
      timestamp: new Date(),
      likes: [],
    });
    await post.save();
    return res.status(201).send(post);
  } catch (err: Error | any) {
    next(err);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err: Error | any) {
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.json({ message: "post does not exists" });
    }
    try {
        await Post.findByIdAndRemove(post._id)
        return res.status(200).json({message: "post removed"})
    } catch (err: Error | any) {
      next(err);
    }
  } catch (err: Error | any) {
    next(err);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.json({ message: "post does not exists" });
    } else {
      try {
        const { title, text } = req.body as { title: string; text: string };
        // author for testing replace with params or req.author
        const postUpdate = Post.build({
          title,
          text,
          author: new Types.ObjectId("64b91a116b03c6637bd49a14"),
          timestamp: new Date(),
          likes: [],
          _id: post._id
        });
        await Post.findByIdAndUpdate(post._id, postUpdate, {});
        return res.status(201).send(post);
      } catch (err: Error | any) {
        next(err);
      }
    }

  } catch (err: Error | any) {
    next(err);
  }
    
    }