import { Request, Response, NextFunction } from "express";
import { Comment } from "../models/comment.model";
import mongoose, { Types } from "mongoose";
import { UserWithObjectsIDs } from "../interfaces/userI";
import { Post } from "../models/post.model";
import { CommentI } from "../interfaces/commentI";


export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.postId).populate('comments').populate({path: 'comments', populate:{path:'author', model:"User"}}).populate('author');
    return res.status(200).json(post);
  } catch (err: Error | any) {
    next(err);
  }
};

export const postComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const postId = req.body.post;
    const text = req.body.text;
    const user = req.user as UserWithObjectsIDs;

    const comment = Comment.build({
      text,
      author: user._id,
      timestamp: new Date(),
      likes: [],
      post: new Types.ObjectId(req.params.postId),
    });
    const addedComment = await comment.save();
    const newCommentId = addedComment._id;
    await Post.findByIdAndUpdate(postId, { $push: { comments: newCommentId } });
    return res.status(201).json({ success: true, message: "New comment added" });
  } catch (err: Error | any) {
    next(err);
  }
};

export const getComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    return res.status(200).json(comment);
  } catch (err: Error | any) {
    next(err);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRequesting = req.user as UserWithObjectsIDs;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.json({ message: "comment does not exists" });
    }
    if(comment.author.toString() !== userRequesting._id.toString() ){
      return res.status(403).json({sucess: false, message: "only author can remove comment"})
    }
      try {
        await Comment.findByIdAndRemove(comment._id);
        return res.status(200).json({sucess:true, message: "comment removed" });
      } catch (err: Error | any) {
        next(err);
      }
    
  } catch (err: Error | any) {
    next(err);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRequesting = req.user as UserWithObjectsIDs;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.json({ message: "comment does not exists" });
    } 
    if(comment.author.toString() !== userRequesting._id.toString() ){
      return res.status(403).json({sucess: false, message: "only author can edit comment"})
    }
      try {
        const text = req.body.text;
        const postId = req.body.post;
        const likes = req.body.likes as string[];
        const likesObjectId = likes.map(like=> new mongoose.Types.ObjectId(like))
        const commentUpdate = Comment.build({
          text,
          author: userRequesting._id,
          timestamp: new Date(),
          likes: likesObjectId,
          post: postId,
          _id: comment._id,
        });
        await Comment.findByIdAndUpdate(comment._id, commentUpdate);
        return res.status(201).send(commentUpdate);
      } catch (err: Error | any) {
        next(err);
      }
    
  } catch (err: Error | any) {
    next(err);
  }
};

export const likeComment = async (req: Request, res: Response, next: NextFunction) => {
  const userRequesting = req.user as UserWithObjectsIDs;
  const userId = new mongoose.Types.ObjectId(userRequesting._id)
  const id = req.params.commentId;
  try {
    const comment = (await Comment.findById(id)) as CommentI;
    if (comment.likes.includes(userId)) {
      try{
        await Comment.findByIdAndUpdate(id, {$pull: {likes: userId}})
        return res.status(200).json({sucess: true, message: "removed like"})
      }catch (err: Error | any) {
        next(err);
      }
    }
    try {
      await Comment.findByIdAndUpdate(id, { $push: { likes: userId } } )
      return res.status(200).json({sucess: true, message: "added like"})
    } catch (err: Error | any) {
      next(err);
    }
  } catch (err: Error | any) {
    next(err);
  }
}