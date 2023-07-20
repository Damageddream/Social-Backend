"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
// connects user with facebook
router.get('/login/facebook', passport_1.default.authenticate('facebook'));
//Facebook url callback on sucess or failure response
router.get('/auth/callback', passport_1.default.authenticate("facebook", {
    successRedirect: "/sucess",
    failureRedirect: "/login/failed",
}));
router.get('/sucess', (req, res, next) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            cookies: req.cookies
        });
    }
});
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map