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

module.exports = router;
