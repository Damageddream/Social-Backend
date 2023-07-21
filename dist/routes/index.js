"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const user_1 = require("../controllers/user");
const posts_1 = require("../controllers/posts");
const posts_2 = require("../controllers/posts");
const router = express_1.default.Router();
// connects user with facebook
router.get('/login/facebook', passport_1.default.authenticate('facebook'));
//Facebook url callback on sucess or failure response
router.get('/auth/callback', passport_1.default.authenticate("facebook", {
    successRedirect: "/sucess",
    failureRedirect: "/login/failed",
}));
// response after sucesfull login
router.get('/sucess', user_1.getSucess);
// response after fail login
router.get("/login/failed", user_1.getFailure);
//routes for posts
router.get("/posts", posts_1.getPosts);
router.post("/posts", posts_2.postPost);
router.get("/posts/:id");
router.delete("/posts/:id");
router.put("/posts/:id");
// routes for comments
router.get("posts/:id/comments");
router.post("posts/:id/comments");
router.get("posts/:postId/comments/:commentId");
router.delete("posts/:postId/comments/:commentId");
router.put("posts/:postId/comments/:commentId");
exports.default = router;
//# sourceMappingURL=index.js.map