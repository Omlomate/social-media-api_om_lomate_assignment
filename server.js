const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts"); // make sure it's posts or comments
const commentRoutes = require("./routes/comments"); // check if you need both

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize socket.io with the HTTP server

// Use socket.io globally for all routes
app.use((req, res, next) => {
  req.io = io; // Attach io instance to request
  next();
});

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes); // Posts route (ensure this is correct)
app.use("/api/comments", commentRoutes); // Comments route (ensure this is correct)

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
