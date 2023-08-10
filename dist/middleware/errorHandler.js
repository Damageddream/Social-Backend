"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// handling errors at the end of app
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    console.error(err);
    res.status(statusCode);
    res.json({
        message: err.message
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map