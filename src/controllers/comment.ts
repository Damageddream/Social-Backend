import { Request, Response, NextFunction } from "express";
import { Comment } from "../models/comment.model";
import { Types } from "mongoose";

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await Comment.find({ post: req.params.postId });
    return res.status(200).json(comment);
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
    const text = req.body.text;
    const comment = Comment.build({
      text,
      author: new Types.ObjectId("64b91a116b03c6637bd49a14"),
      timestamp: new Date(),
      likes: [],
      post: new Types.ObjectId(req.params.postId),
    });
    await comment.save();
    return res.status(201).send(comment);
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
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.json({ message: "comment does not exists" });
    } else {
      try {
        await Comment.findByIdAndRemove(comment._id);
        return res.status(200).json({message :"comment removed"})
      } catch (err: Error | any) {
        next(err);
      }
    }
  } catch (err: Error | any) {
    next(err);
  }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const comment = await Comment.findById(req.params.commentId)
        if (!comment) {
            return res.json({ message: "comment does not exists" });
        } else {
            try {
                const text = req.body.text;
                const commentUpdate = Comment.build({
                  text,
                  author: new Types.ObjectId("64b91a116b03c6637bd49a14"),
                  timestamp: new Date(),
                  likes: [],
                  post: new Types.ObjectId(req.params.postId),
                  _id: comment._id,
                });
                await Comment.findByIdAndUpdate(comment._id, commentUpdate, {});
                return res.status(201).send(commentUpdate);
              } catch (err: Error | any) {
                next(err);
              }
        }

    } catch (err: Error | any) {
        next(err);
      }
}