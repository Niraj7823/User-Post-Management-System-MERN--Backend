import express from "express";
import { User } from "../modules/user.module.js";
import { adminMiddleware } from "../controllers/user.controller.js";

const router = express.Router();

// GET all users (Admin only)
router.get("/users", adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a user (Admin only)
router.delete("/users/:id", adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
