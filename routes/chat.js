const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// Store messages in-memory or you can integrate with DB for persistence
let messages = []; // Store messages temporarily in memory (use DB for persistence in production)

// Chat: Get all messages
router.get("/", verifyToken, (req, res) => {
  res.status(200).json({ messages });
});

// Chat: Send a message
router.post("/", verifyToken, (req, res) => {
  const { text } = req.body;
  const message = {
    text,
    user: req.user.id,
    timestamp: new Date(),
  };

  // Emit the new message to all connected clients
  req.io.emit("newMessage", message);

  // Store message temporarily (use DB to persist in production)
  messages.push(message);

  res.status(201).json({ message: "Message sent", message });
});

module.exports = router;
