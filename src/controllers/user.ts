
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import {UserI} from '../interfaces/userI'

export const authenticate = (req: Request, res: Response, next: NextFunction) =>{
    passport.authenticate('facebook', (err: Error, user: UserI) => {
        if(err) {
            next(err)
        }

        if(!user) {
            return res.status(401).json({error: "Authentication Failed"})
        }

        res.status(200).json({user})
    })
}

