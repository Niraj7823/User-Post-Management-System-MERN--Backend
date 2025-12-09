import { Router } from "express";
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  getPostsByUser, // make sure this is exported from your controller
} from "../controllers/post.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(auth, createPost);
router.route("/getPosts").get(auth, getPost);
router.route("/updates/:id").patch(auth, updatePost);
router.route("/deletePost/:id").delete(auth, deletePost);

// NEW: Route for admin to fetch posts of a specific user
router.route("/user/:id").get(auth, getPostsByUser);

export default router;
