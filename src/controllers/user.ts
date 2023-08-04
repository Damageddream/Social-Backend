import express, { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { UserIwithID } from "../interfaces/userI";

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
    console.log(req.user);
  } catch (err) {
    next(err);
  }
};
