import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

const connectToDb = async (req:Request, res: Response, next:NextFunction) => {
    const mongoDB = process.env.DB_KEY as string;
    try {
        await mongoose.connect(mongoDB);
        next()
    } catch(error){
        console.error("failed to connect to to MongoDB", error);
        res.status(500).send("Internal Server Error")
    }
};

export default connectToDb;


