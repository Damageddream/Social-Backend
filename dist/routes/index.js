"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const user_1 = require("../controllers/user");
const posts_1 = require("../controllers/posts");
const comment_1 = require("../controllers/comment");
const router = express_1.default.Router();
// connects user with facebook
router.get("/login/facebook", passport_1.default.authenticate("facebook"));
//Facebook url callback on sucess or failure response
router.get("/auth/callback", passport_1.default.authenticate("facebook", {
    successRedirect: "http://localhost:5173/wall",
    failureRedirect: "/login/failed",
}));
// response after sucesfull login
router.get("/sucess", user_1.getSucess);
// response after fail login
router.get("/login/failed", user_1.getFailure);
//routes for posts
router.get("/posts", passport_1.default.authenticate("jwt", { session: false }), posts_1.getPosts);
router.post("/posts", passport_1.default.authenticate("jwt", { session: false }), posts_1.postPost);
router.get("/posts/:id", posts_1.getPost);
router.delete("/posts/:id", posts_1.deletePost);
router.put("/posts/:id", posts_1.updatePost);
// routes for comments
router.get("/posts/:postId/comments", comment_1.getComments);
router.post("/posts/:postId/comments", comment_1.postComment);
router.get("/posts/:postId/comments/:commentId", comment_1.getComment);
router.delete("/posts/:postId/comments/:commentId", comment_1.deleteComment);
router.put("/posts/:postId/comments/:commentId", comment_1.updateComment);
//routes for users
router.get("/users");
router.get("/users/nofriends", passport_1.default.authenticate("jwt", { session: false }), user_1.getNoFriends);
exports.default = router;
//# sourceMappingURL=index.js.map