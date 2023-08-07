import express, { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { UserIwithID } from "../interfaces/userI";
import { CustomUser } from "../interfaces/userI";
import mongoose from "mongoose";

// sucesfull login response
export const getSucess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    const userRequest = req.user as UserIwithID;
    try {
      const user = await User.findById(req.user);
      const secret = process.env.SECRET as string;
      const token = jwt.sign({ user }, secret);
      return res.status(200).json({
        success: true,
        message: "successfull",
        user,
        token,
      });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(401).json({
      message: "problem with authentication",
    });
  }
};

// failure login reponse
export const getFailure = (req: Request, res: Response, next: NextFunction) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
};

export const getLogout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: Error) => {
    if (err) {
      return next(err);
    }
    res.redirect(process.env.CLIENT_URL as string);
  });
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err: Error | any) {
    next(err);
  }
};

export const getNoFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user) {
      const userWithId = req.user as CustomUser;
      const user = await User.findById(userWithId._id.toString());
      // array of friends of user
      const friends: string[] = [];
      user?.friends.forEach((friend) => {
        friends.push(friend.toString());
      });
      user?.invitesSent.forEach((friend) => {
        friends.push(friend.toString());
      });

      friends.push(userWithId._id.toString());

      // array of all users there are no friends with user
      const noFriends = await User.find({ _id: { $nin: friends } });
      return res.status(200).json({
        success: true,
        noFriends,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "request must be send by user",
      });
    }
  } catch (err) {
    next(err);
  }
};

export const postInvite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRequesting = req.user as CustomUser;
    const { id } = req.body;
    const objectId = new mongoose.Types.ObjectId(id);
    const user = await User.findById(userRequesting._id.toString());
    const friend = await User.findById(id);

    if (user?.friends.includes(objectId)) {
      return res.status(409).json({ message: "you are already friends" });
    }
    if (user?.invitesSent.includes(objectId)) {
      return res
        .status(409)
        .json({ message: "you are already sent request to that user" });
    }

    const updatedUser = { $push: { invitesSent: objectId } };
    const updatedFriend = { $push: { invites: userRequesting._id } };

    try {
      await User.findByIdAndUpdate(
        userRequesting._id.toString(),
        updatedUser,
        {}
      );
      await User.findByIdAndUpdate(id, updatedFriend, {});
      return res.status(200).json({
        sucess: true,
        message: "invite send sucessfully",
      });
    } catch (err: Error | any) {
      next(err);
    }

    return res.status(200).json({
      sucess: true,
      message: "invite send sucessfully",
    });
  } catch (err: Error | any) {
    next(err);
  }
};
