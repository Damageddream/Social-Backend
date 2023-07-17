import { NextFunction, Request, Response } from 'express';

// handling errors at the end of app
const errorHandler = (err: Error, req:Request, res:Response, next: NextFunction) => {
    const statusCode = res.statusCode !==200? res.statusCode : 500
    res.status(statusCode);
    res.json({
        message: err.message
    })
}

export default errorHandler;