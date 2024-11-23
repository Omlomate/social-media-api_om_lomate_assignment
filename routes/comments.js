//routes/comment.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { verifyToken } = require("../middleware/auth");

// Add a comment
router.post(
  "/",
  [
    verifyToken,
    body("postId").notEmpty().withMessage("Post ID is required").isMongoId().withMessage("Invalid Post ID"),
    body("text").notEmpty().withMessage("Comment text is required").isLength({ max: 500 }).withMessage("Comment is too long"),
  ],
  async (req, res) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { postId, text } = req.body;

    try {
      // Check if the post exists
      const post = await Post.findById(postId).exec();
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      // Create the comment
      const comment = new Comment({
        text,
        post: postId,
        user: req.user.id,
      });
      await comment.save();

      // Emit a notification event
      if (req.io) {
        req.io.emit("newComment", {
          postId,
          comment: {
            id: comment._id,
            text: comment.text,
            user: req.user.id,
            createdAt: comment.createdAt,
          },
        });
      }

      res.status(201).json({ success: true, message: "Comment added successfully", data: comment });
    } catch (error) {
      console.error("Error adding comment:", error.message);
      res.status(500).json({ success: false, message: "Error adding comment", error: error.message });
    }
  }
);

module.exports = router;
