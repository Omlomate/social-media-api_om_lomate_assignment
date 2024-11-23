// routes/posts.js
const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();
const Post = require("../models/Post");
const { verifyToken } = require("../middleware/auth");

// Create a new post
router.post(
  "/",
  [
    verifyToken,
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, content } = req.body;

    try {
      const newPost = new Post({
        title,
        content,
        user: req.user.id, // User ID from token
      });

      await newPost.save();

      // Emit socket event for new post
      if (req.io) {
        req.io.emit("newPost", {
          id: newPost._id,
          title: newPost.title,
          content: newPost.content,
          user: req.user.id,
        });
      }

      res.status(201).json({ success: true, message: "Post created successfully", data: newPost });
    } catch (error) {
      console.error("Error creating post:", error.message);
      res.status(500).json({ success: false, message: "Error creating post", error: error.message });
    }
  }
);

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username");
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ success: false, message: "Error fetching posts", error: error.message });
  }
});

// Get a single post by ID
router.get(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid Post ID"),
    verifyToken,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.id).populate("user", "username");
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      console.error("Error fetching post:", error.message);
      res.status(500).json({ success: false, message: "Error fetching post", error: error.message });
    }
  }
);

// Update a post
router.put(
  "/:id",
  [
    verifyToken,
    param("id").isMongoId().withMessage("Invalid Post ID"),
    body("title").optional().isString(),
    body("content").optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { title, content } = req.body;

      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Not authorized to update this post" });
      }

      post.title = title || post.title;
      post.content = content || post.content;

      await post.save();
      res.status(200).json({ success: true, message: "Post updated successfully", data: post });
    } catch (error) {
      console.error("Error updating post:", error.message);
      res.status(500).json({ success: false, message: "Error updating post", error: error.message });
    }
  }
);

// Delete a post
router.delete(
  "/:id",
  [
    verifyToken,
    param("id").isMongoId().withMessage("Invalid Post ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Not authorized to delete this post" });
      }

      await post.remove();
      res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error.message);
      res.status(500).json({ success: false, message: "Error deleting post", error: error.message });
    }
  }
);

module.exports = router;
