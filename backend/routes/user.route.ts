import express from "express";
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  Login,
  Logout,
  Register,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
  addComment,
  addNewPost,
  getAllPosts,
  getUserPost,
  likePost,
  unlikePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(Logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePicture"), editProfile);

router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followorunfollow/:id").post(isAuthenticated, followOrUnfollow);
router
  .route("/addnewpost")
  .post(isAuthenticated, upload.single("image"), addNewPost);

router.route("/getallposts").get(getAllPosts);
router.route("/addcomment/:id").post(isAuthenticated, addComment);
router.route("/getuserpost").get(isAuthenticated, getUserPost);

router.route("/likepost/:id").post(isAuthenticated, likePost);
router.route("/unlikepost/:id").post(isAuthenticated, unlikePost);

export default router;
