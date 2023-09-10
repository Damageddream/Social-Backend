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
const multer_1 = __importDefault(require("multer"));
const path = require('path');
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDirectory = path.join(__dirname, '../public');
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: storage });
// connects user with facebook
router.get("/login/facebook", passport_1.default.authenticate("facebook"));
//Facebook url callback on sucess or failure response
router.get("/auth/callback", passport_1.default.authenticate("facebook", {
    successRedirect: "http://localhost:5173/loginFacebook",
    failureRedirect: "/login/failed",
}));
// response after sucesfull login
router.get("/sucess", user_1.getSucess);
// response after fail login
router.get("/login/failed", user_1.getFailure);
//routes for posts
router.get("/posts", passport_1.default.authenticate("jwt", { session: false }), posts_1.getPosts);
router.post("/posts", passport_1.default.authenticate("jwt", { session: false }), posts_1.postPost);
router.get("/posts/:id", passport_1.default.authenticate("jwt", { session: false }), posts_1.getPost);
router.delete("/posts/:id", passport_1.default.authenticate("jwt", { session: false }), posts_1.deletePost);
router.put("/posts/:id", passport_1.default.authenticate("jwt", { session: false }), posts_1.updatePost);
router.get("/wall", passport_1.default.authenticate("jwt", { session: false }), posts_1.getPostsWall);
router.post("/posts/:id/like", passport_1.default.authenticate("jwt", { session: false }), posts_1.likePost);
// routes for comments
router.get("/posts/:postId/comments", passport_1.default.authenticate("jwt", { session: false }), comment_1.getComments);
router.post("/posts/:postId/comments", passport_1.default.authenticate("jwt", { session: false }), comment_1.postComment);
router.get("/comments/:commentId", passport_1.default.authenticate("jwt", { session: false }), comment_1.getComment);
router.delete("/comments/:commentId", passport_1.default.authenticate("jwt", { session: false }), comment_1.deleteComment);
router.put("/comments/:commentId", passport_1.default.authenticate("jwt", { session: false }), comment_1.updateComment);
router.post("/comments/:commentId/like", passport_1.default.authenticate("jwt", { session: false }), comment_1.likeComment);
//routes for users interactions
router.get("/users");
router.get("/users/friends", passport_1.default.authenticate("jwt", { session: false }), user_1.getFriends);
router.get("/users/nofriends", passport_1.default.authenticate("jwt", { session: false }), user_1.getNoFriends);
router.post("/users/nofriends", passport_1.default.authenticate("jwt", { session: false }), user_1.postInvite);
router.get("/users/invites", passport_1.default.authenticate("jwt", { session: false }), user_1.getInvites);
router.post("/users/invites", passport_1.default.authenticate("jwt", { session: false }), user_1.postInvites);
router.post("/users/register", upload.single("file"), user_1.postRegister);
router.post("/users/login", user_1.postLogin);
router.put("/user/edit/:id", passport_1.default.authenticate("jwt", { session: false }), upload.single("file"), user_1.editUser);
exports.default = router;
//# sourceMappingURL=index.js.map