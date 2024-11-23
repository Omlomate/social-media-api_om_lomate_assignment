//routes/chat.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// In-memory message storage (use a database in production)
let messages = [];

// Chat: Get all messages
router.get("/", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    messages,
  });
});

// Chat: Send a message
router.post(
  "/",
  [
    verifyToken,
    body("text").notEmpty().withMessage("Message text is required").isLength({ max: 500 }).withMessage("Message is too long"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { text } = req.body;
    const message = {
      text,
      user: req.user.id,
      name: req.user.name || "Anonymous", // Optionally include user name
      timestamp: new Date(),
    };

    // Emit the new message to all connected clients
    if (req.io) {
      req.io.emit("newMessage", message);
    }

    // Temporarily store message (replace with DB persistence in production)
    messages.push(message);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  }
);

module.exports = router;
