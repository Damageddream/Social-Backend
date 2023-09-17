import { Request, Response, NextFunction } from "express";
import { Post } from "../models/post.model";
import mongoose, { Types } from "mongoose";
import { UserWithObjectsIDs } from "../interfaces/userI";
import { PostI } from "../interfaces/postI";
import { Comment } from "../models/comment.model";

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
  const user = req.user as UserWithObjectsIDs;
  try {
    const { title, text } = req.body as { title: string; text: string };
    const post = Post.build({
      title,
      text,
      author: user._id,
      timestamp: new Date(),
      likes: [],
      comments: [],
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
    const userRequesting = req.user as UserWithObjectsIDs;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post does not exists" });
    }
    if(post.author.toString() !== userRequesting._id.toString() ){
      return res.status(403).json({sucess: false, message: "only author can remove post"})
    }
    try {
      const removedPost = Post.findByIdAndRemove(post._id);
      const removedComments = Comment.deleteMany({post: post._id})
      await Promise.all([removedComments, removedPost])
      return res.status(200).json({sucess:true, message: "post removed" });
    } catch (err: Error | any) {
      next(err);
    }
  } catch (err: Error | any) {
    next(err);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRequesting = req.user as UserWithObjectsIDs;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.json({ message: "post does not exists" });
    }
    if(post.author.toString() !== userRequesting._id.toString() ){
      return res.status(403).json({sucess: false, message: "only author can edit post"})
    }
      try {
        const { title, text, likes, comments } = req.body as { title: string; text: string; likes: string[], comments: string[] };
        const likesObjectId = likes.map(like=> new mongoose.Types.ObjectId(like))
        const commentsObjectId = comments.map(comment=> new mongoose.Types.ObjectId(comment))
        // author for testing replace with params or req.author
        const postUpdate = Post.build({
          title,
          text,
          author: userRequesting._id,
          timestamp: new Date(),
          likes: likesObjectId,
          _id: post._id,
          comments: commentsObjectId,
        });
        await Post.findByIdAndUpdate(post._id, postUpdate);
        return res.status(201).send(post);
      } catch (err: Error | any) {
        next(err);
      }
    
  } catch (err: Error | any) {
    next(err);
  }
};

export const getPostsWall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRequesting = req.user as UserWithObjectsIDs;
  const friendsAndUserPosts: Types.ObjectId[] = [
    ...userRequesting.friends,
    userRequesting._id,
  ];
  try {
    const posts = await Post.find({ author: { $in: friendsAndUserPosts } }).populate('author');
    return res
      .status(200)
      .json({ success: true, message: "sucesfully fetched posts", posts });
  } catch (err: Error | any) {
    next(err);
  }
};

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRequesting = req.user as UserWithObjectsIDs;
  const userId = new mongoose.Types.ObjectId(userRequesting._id)
  const id = req.params.id;
  try {
    const post = (await Post.findById(id)) as PostI;
    if (post.likes.includes(userId)) {
      try{
        await Post.findByIdAndUpdate(id, {$pull: {likes: userId}})
        return res.status(200).json({sucess: true, message: "removed like"})
      }catch (err: Error | any) {
        next(err);
      }
    }
    try {
      await Post.findByIdAndUpdate(id, { $push: { likes: userId } } )
      return res.status(200).json({sucess: true, message: "added like"})
    } catch (err: Error | any) {
      next(err);
    }
  } catch (err: Error | any) {
    next(err);
  }
};
