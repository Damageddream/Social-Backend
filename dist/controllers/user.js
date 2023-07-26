"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogout = exports.getFailure = exports.getSucess = void 0;
// sucesfull login response
const getSucess = (req, res, next) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            cookies: req.cookies
        });
    }
    else {
        res.status(401).json({
            message: "problem with authentication"
        });
    }
};
exports.getSucess = getSucess;
// failure login reponse
const getFailure = (req, res, next) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
};
exports.getFailure = getFailure;
const getLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect(process.env.CLIENT_URL);
    });
};
exports.getLogout = getLogout;
//# sourceMappingURL=user.js.map