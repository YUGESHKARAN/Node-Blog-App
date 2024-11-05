const express = require("express");
const cors = require("cors");
const path = require("path");
const connectToDatabase = require("./db"); // Import database connection

const PORT = process.env.PORT || 3000; // Use environment port or default to 3000
const app = express();

// Connect to MongoDB once
connectToDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const loginRouter = require("./routes/login.Route");
app.use("/blog/login", loginRouter);

const authorRouter = require("./routes/authorDetail.Route");
app.use("/blog/author", authorRouter);

const postRouter = require("./routes/postDetail.Route");
app.use("/blog/posts", postRouter);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Set a timeout for requests
app.use((req, res, next) => {
  req.setTimeout(5000, () => {
    res.status(504).send("Request timed out.");
  });
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server connected on port ${PORT}`);
});
