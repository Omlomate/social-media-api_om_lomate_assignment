// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minLength: 3 },
    content: { type: String, required: true, trim: true, minLength: 5 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, // Reference to comments
    ],
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` automatically
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
