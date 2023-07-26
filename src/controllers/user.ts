import express, { NextFunction, Request, Response } from 'express';

// sucesfull login response
export const getSucess = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        res.status(200).json({
          success: true,
          message: "successfull",
          user: req.user,
          cookies: req.cookies
        });
      }
      else{
        res.status(401).json({
            message: "problem with authentication"
        })
      }

}

// failure login reponse
export const getFailure = (req: Request, res: Response, next: NextFunction) => {
    res.status(401).json({
        success: false,
        message: "failure",
      });
}

export const getLogout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: Error) => {
    if(err){
      return next(err)
    }
    res.redirect(process.env.CLIENT_URL as string)
  });

}
