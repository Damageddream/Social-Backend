"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const passport_1 = __importDefault(require("passport"));
const authenticate = (req, res, next) => {
    passport_1.default.authenticate('facebook', (err, user) => {
        if (err) {
            next(err);
        }
        if (!user) {
            return res.status(401).json({ error: "Authentication Failed" });
        }
        res.status(200).json({ user });
    });
};
exports.authenticate = authenticate;
//# sourceMappingURL=user.js.map