const express = require("express");
const cors = require("cors");
const path = require("path");
const serverless = require('serverless-http');
const connectToDatabase = require("./db"); // Import database connection

// s3 integration
const { S3Client,PutObjectCommand } = require("@aws-sdk/client-s3");
require('dotenv').config()


const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;


const s3 = new S3Client({
  credentials:{
    accessKeyId:accessKey,
    secretAccessKey:secretAccessKey,
  },
  region:bucketRegion
})


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

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server connected on port ${PORT}`);
// });

module.exports = app;
module.exports.handler = serverless(app); // Wrap Express app