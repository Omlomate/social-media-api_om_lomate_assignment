//models/Comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
