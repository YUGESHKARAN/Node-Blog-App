const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const serverless = require("serverless-http");
const connectToDatabase = require("./db");
const bodyParser = require("body-parser");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Server } = require("socket.io");
require("dotenv").config();

// AWS S3 configuration
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

// Server configuration
const PORT = process.env.PORT || 3000;
const app = express();

// Connect to MongoDB
connectToDatabase();

// Middleware setup
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
const loginRouter = require("./routes/login.Route");
const authorRouter = require("./routes/authorDetail.Route");
const postRouter = require("./routes/postDetail.Route");

app.use("/blog/login", loginRouter);
app.use("/blog/author", authorRouter);
app.use("/blog/posts", postRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(5000, () => res.status(504).send("Request timed out."));
  next();
});

// Real-time messaging with Socket.IO
const Author = require("./models/blogAuthorSchema"); // Ensure correct path
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "blog-frontend-teal-ten.vercel.app", methods: ["GET", "POST"] } });
const corsOptions = {
  origin: 'blog-frontend-teal-ten.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

// test
app.use(cors(corsOptions));
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinPostRoom", (postId) => {
    socket.join(postId);
    console.log(`User joined room: ${postId}`);
  });

  socket.on("newMessage", async (data) => {
    const { postId, user, email, message } = data;
    try {
      const author = await Author.findOne({ "posts._id": postId }, { "posts.$": 1 });
      if (!author || !author.posts || author.posts.length === 0) {
        console.error("Post not found");
        return;
      }

      const authorProfile = await Author.findOne({ email });
      const profile = authorProfile?.profile || "";

      const post = author.posts[0];
      const newMessage = { user, message, profile };
      post.messages.push(newMessage);
      console.log("New message:", newMessage);

      await Author.updateOne(
        { "posts._id": postId },
        { $push: { "posts.$.messages": newMessage } }
      );

      io.to(postId).emit("message", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server connected on port ${PORT}`);
});

module.exports = app;
module.exports.handler = serverless(app);
