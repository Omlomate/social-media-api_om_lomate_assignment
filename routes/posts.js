// routes/posts.js

const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { verifyToken } = require("../middleware/auth");

// Create a new post
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Check if title and content are provided
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Create a new post
    const newPost = new Post({
      title,
      content,
      user: req.user.id, // Assuming user is available in req.user after token verification
    });

    // Save the post to the database
    await newPost.save();

    // Emit a socket.io event to notify about the new post
    req.io.emit("newPost", newPost);

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
});

// Get all posts
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username"); // Fetch all posts and populate user info
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// Get a single post by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", "username");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
});

// Update a post
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Find the post by ID and check if the user is the author
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    // Update the post
    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();
    res.status(200).json({ message: "Post updated", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
});

// Delete a post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the author of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.remove();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});

module.exports = router;
