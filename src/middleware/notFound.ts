import { NextFunction, Request, Response } from 'express';


// returning status 404 when page is not found
const notFound = (req:Request, res:Response, next:NextFunction) => {
    res.status(404)
    const error = new Error(`Page not found - ${req.originalUrl}`)
    next(error)
}

export default notFound;