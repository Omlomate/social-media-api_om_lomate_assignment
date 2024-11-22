const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { verifyToken } = require("../middleware/auth");

// Add a comment
router.post("/", verifyToken, async (req, res) => {
  try {
    const { postId, text } = req.body;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create the comment
    const comment = new Comment({
      text,
      post: postId,
      user: req.user.id,
    });
    await comment.save();

    // Emit a notification event
    req.io.emit("newComment", {
      postId: postId,
      comment: comment,
      user: req.user.id,
    });

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

// Get all posts
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find(); // Fetch all posts from the database
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

module.exports = router;
