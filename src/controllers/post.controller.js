import { Post } from "../modules/post.module.js";

//Create post

const createPost = async (req, res) => {
  try {
    const { name, description, age } = req.body;
    if (!name || !description || !age)
      return res.status(400).json({ message: "All field are require" });
    const post = await Post.create({
      name,
      description,
      age,
      user_id: req.user.id, // <-- logged-in user
    });
    res.status(201).json({
      message: "post successfully created",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
const getPost = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 5;
    let skip = (page - 1) * limit;
    const totalPosts = await Post.countDocuments({ user_id: req.user.id });
    const totalPages = Math.ceil(totalPosts / limit);
    const posts = await Post.find({ user_id: req.user.id })
      .skip(skip)
      .limit(limit);
    res.status(200).json({ posts, totalPages, nbHit: posts.length });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",

      error,
    });
  }
};
const updatePost = async (req, res) => {
  try {
    if (Object.keys(req?.body).length === 0)
      return res.status(400).json({ message: "No data provided for update" });

    const post = await Post.findByIdAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      {
        new: true,
      }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({
      message: "Updated successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
const deletePost = async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });
    console.log(deleted);
    if (!deleted)
      return res.status(404).json({
        message: "Post not found",
      });
    res.status(200).json({
      message: "Post successfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getPostsByUser = async (req, res) => {
  try {
    const { id } = req.params; // get userId from route
    const posts = await Post.find({ user_id: id }).populate(
      "user_id",
      "username email"
    );

    if (!posts || posts.length === 0)
      return res.status(404).json({ message: "No posts found for this user" });

    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export { createPost, getPost, updatePost, deletePost, getPostsByUser };
