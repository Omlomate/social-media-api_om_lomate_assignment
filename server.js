const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server); // Initialize Socket.io

app.use(cors());
app.use(express.json());

// Add socket.io to req object (so it's available in routes)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Connection to MongoDB
mongoose.connect("your_mongoDB_connection_string", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// Server listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
