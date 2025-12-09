import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
// import { auth } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../controllers/user.controller.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/getUsers").get(getUsers);
router.route("/updataUser/:id").patch(updateUser);
router.route("/deleteUser/:id").delete(deleteUser);
router.route("/admin").get(adminMiddleware);

export default router;
