const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware for socket.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Serve Static Files
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath, { maxAge: "1d" })); // Cache static files

// Serve `index.html` for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Socket.IO Event Handlers
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (error) => {
    console.error("Socket.IO Error:", error);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Gracefully shutting down");
  await mongoose.connection.close();
  server.close(() => process.exit(0));
});
