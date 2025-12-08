import { User } from "../modules/user.module.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    //basic validation
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All field are required" });
    }
    //check if user exist already
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "user already exists!" });
    }

    //create user
    const user = await User.create({
      username,
      password: hashedPassword,
      email: email.toLowerCase(),
      loggedIn: false,
    });
    res.status(201).json({
      message: "user registered",
      user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ massage: "Internal server error", error: error.massage });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // CREATE JWT TOKEN (important: do it before sending response)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send final response only ONCE
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",

      error,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const updateUser = async (req, res) => {
  try {
    if (Object.keys(req?.body).length === 0)
      return res.status(400).json({ message: "No data provided for updata" });
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not fund" });
    res.status(200).json({
      message: "User Successfully updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    console.log(deleteUser);
    if (!deleteUser) return res.status(404).json({ message: "User not found" });
    await Post.deleteMany({ user_id: req.params.id });
    res.status(200).json({ message: "User Successfully Deleted", deleteUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  adminMiddleware,
  updateUser,
  deleteUser,
};
