"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// returning status 404 when page is not found
const notFound = (req, res, next) => {
    res.status(404);
    const error = new Error(`Page not found - ${req.originalUrl}`);
    next(error);
};
exports.default = notFound;
//# sourceMappingURL=notFound.js.map