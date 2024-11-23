//routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { body, validationResult } = require("express-validator"); // Input validation middleware
const router = express.Router();

// Register User
router.post(
  "/register",
  [
    // Validation middleware
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      const user = await User.create({ name, email, password });
      res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error during user registration",
      });
    }
  }
);

// Login User
router.post(
  "/login",
  [
    // Validation middleware
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });
      }

      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h", // Configurable expiry time
      });

      // Optional: Send token as a secure cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only secure in production
        sameSite: "Strict",
        maxAge: 3600000, // 1 hour
      });

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Logged out" });
});

module.exports = router;
