// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const http = require("http");
// const serverless = require("serverless-http");
// const connectToDatabase = require("./db");
// const bodyParser = require("body-parser");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const { Server } = require("socket.io");
// require("dotenv").config();

// // AWS S3 configuration
// const bucketName = process.env.BUCKET_NAME;
// const bucketRegion = process.env.BUCKET_REGION;
// const accessKey = process.env.ACCESS_KEY;
// const secretAccessKey = process.env.SECRET_ACCESS_KEY;

// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: accessKey,
//     secretAccessKey: secretAccessKey,
//   },
//   region: bucketRegion,
// });

// // Server configuration
// const PORT = process.env.PORT || 3000;
// const app = express();

// // Connect to MongoDB
// connectToDatabase();

// // Middleware setup
// app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Routes
// const loginRouter = require("./routes/login.Route");
// const authorRouter = require("./routes/authorDetail.Route");
// const postRouter = require("./routes/postDetail.Route");

// app.use("/blog/login", loginRouter);
// app.use("/blog/author", authorRouter);
// app.use("/blog/posts", postRouter);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Root route
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// // Request timeout middleware
// app.use((req, res, next) => {
//   req.setTimeout(5000, () => res.status(504).send("Request timed out."));
//   next();
// });

// // Real-time messaging with Socket.IO
// const Author = require("./models/blogAuthorSchema"); // Ensure correct path
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "https://blog-frontend-teal-ten.vercel.app", methods: ["GET", "POST"] } });
// const corsOptions = {
//   origin: 'https://blog-frontend-teal-ten.vercel.app',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// };

// // test
// app.use(cors(corsOptions));
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("joinPostRoom", (postId) => {
//     socket.join(postId);
//     console.log(`User joined room: ${postId}`);
//   });

//   socket.on("newMessage", async (data) => {
//     const { postId, user, email, message } = data;
//     try {
//       const author = await Author.findOne({ "posts._id": postId }, { "posts.$": 1 });
//       if (!author || !author.posts || author.posts.length === 0) {
//         console.error("Post not found");
//         return;
//       }

//       const authorProfile = await Author.findOne({ email });
//       const profile = authorProfile?.profile || "";

//       const post = author.posts[0];
//       const newMessage = { user, message, profile };
//       post.messages.push(newMessage);
//       console.log("New message:", newMessage);

//       await Author.updateOne(
//         { "posts._id": postId },
//         { $push: { "posts.$.messages": newMessage } }
//       );

//       io.to(postId).emit("message", newMessage);
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// // Start the server
// server.listen(PORT, () => {
//   console.log(`Server connected on port ${PORT}`);
// });

// module.exports = app;
// module.exports.handler = serverless(app);


// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const http = require("http");
// const serverless = require("serverless-http");
// const connectToDatabase = require("./db");
// const bodyParser = require("body-parser");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const { Server } = require("socket.io");
// require("dotenv").config();

// // AWS S3 configuration
// const bucketName = process.env.BUCKET_NAME;
// const bucketRegion = process.env.BUCKET_REGION;
// const accessKey = process.env.ACCESS_KEY;
// const secretAccessKey = process.env.SECRET_ACCESS_KEY;

// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: accessKey,
//     secretAccessKey: secretAccessKey,
//   },
//   region: bucketRegion,
// });

// // Server configuration
// const PORT = process.env.PORT || 3000;
// const app = express();

// // Connect to MongoDB
// connectToDatabase();

// // Middleware setup
// app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Routes
// const loginRouter = require("./routes/login.Route");
// const authorRouter = require("./routes/authorDetail.Route");
// const postRouter = require("./routes/postDetail.Route");

// app.use("/blog/login", loginRouter);
// app.use("/blog/author", authorRouter);
// app.use("/blog/posts", postRouter);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Root route
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// // Request timeout middleware
// app.use((req, res, next) => {
//   req.setTimeout(5000, () => res.status(504).send("Request timed out."));
//   next();
// });

// // Real-time messaging with Socket.IO
// const Author = require("./models/blogAuthorSchema"); // Ensure correct path

// // Set up HTTP server and Socket.IO
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "https://blog-frontend-teal-ten.vercel.app/", // Match your frontend domain
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
//   transports: ['polling'], 
// });

// // CORS options for Socket.IO
// const corsOptions = {
//   origin: "https://blog-frontend-teal-ten.vercel.app/",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));

// // Socket.IO event handling
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("joinPostRoom", (postId) => {
//     socket.join(postId);
//     console.log(`User joined room: ${postId}`);
//   });

//   socket.on("newMessage", async (data) => {
//     const { postId, user, email, message } = data;
//     try {
//       // Find the post by ID
//       const author = await Author.findOne({ "posts._id": postId }, { "posts.$": 1 });
//       if (!author || !author.posts || author.posts.length === 0) {
//         console.error("Post not found");
//         return;
//       }

//       const authorProfile = await Author.findOne({ email });
//       const profile = authorProfile?.profile || "";

//       // Get the post and add the new message
//       const post = author.posts[0];
//       const newMessage = { user, message, profile };
//       post.messages.push(newMessage);
//       console.log("New message:", newMessage);

//       // Update the post with the new message
//       await Author.updateOne(
//         { "posts._id": postId },
//         { $push: { "posts.$.messages": newMessage } }
//       );

//       // Emit the message to all clients in the room
//       io.to(postId).emit("message", newMessage);
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// // Start the server
// server.listen(PORT, () => {
//   console.log(`Server connected on port ${PORT}`);
// });

// module.exports = app;
// module.exports.handler = serverless(app);



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
app.use(
  cors({
    // origin: ["https://blog-frontend-teal-ten.vercel.app","http://localhost:5173","https://mongodb-rag-rho.vercel.app"],// Match your frontend domain
    origin: ["https://blog-frontend-teal-ten.vercel.app","http://localhost:5173","https://mongodb-rag-rho.vercel.app"],// Match your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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

// Set up HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: ["https://blog-frontend-teal-ten.vercel.app","http://localhost:5173"], // Match your frontend domain
    origin: ["http://localhost:5173"], // Match your frontend domain
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["polling"],
});

// Socket.IO event handling
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("joinPostRoom", (postId) => {
//     console.log(`joinPostRoom event received with postId: ${postId}`);
//     if (!postId) {
//       console.error("Invalid postId received.");
//       return;
//     }
//     socket.join(postId);
//     console.log(`User joined room: ${postId}`);
//   });

//   socket.on("newMessage", async (data) => {
//     const { postId, user, email, message } = data;
//     try {
//       // Find the post by ID
//       const author = await Author.findOne({ "posts._id": postId }, { "posts.$": 1 });
//       if (!author || !author.posts || author.posts.length === 0) {
//         console.error("Post not found");
//         return;
//       }

//       const authorProfile = await Author.findOne({ email });
//       const profile = authorProfile?.profile || "";

//       // Get the post and add the new message
//       const post = author.posts[0];
//       const newMessage = { user, message, profile };
//       post.messages.push(newMessage);

//       // Update the post with the new message
//       await Author.updateOne(
//         { "posts._id": postId },
//         { $push: { "posts.$.messages": newMessage } }
//       );

//       // Emit the message to all clients in the room
//       io.to(postId).emit("message", newMessage);
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

//Map to store user email and their socket IDs

const userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Register user with their email
  socket.on('registerUser', (email) => {
    userSocketMap.set(email, socket.id);
    console.log(`User registered: ${email} with socket ID: ${socket.id}`);
  });

  // Join a specific post room
  socket.on('joinPostRoom', (postId) => {
    socket.join(postId);
    console.log(`User joined room: ${postId}`);
  });

  socket.on('newMessage', async (data) => {
    const { postId, user, email, message } = data;

    try {
      // Find the author and the specific post by postId
      const author = await Author.findOne(
        { 'posts._id': postId },
        { 'email': 1, 'posts.$': 1 }
      );

      if (!author || !author.posts || author.posts.length === 0) {
        console.error('Post not found');
        return;
      }

      const post = author.posts[0];
      const authorEmail = author.email;
      console.log("Author email:", authorEmail);

      // Create the new message object
      const newMessage = { user, message, profile: '' };

      // Update the database with the new message
      await Author.updateOne(
        { 'posts._id': postId },
        { $push: { 'posts.$.messages': newMessage } }
      );

      // Emit the message to all clients in the room except the sender
      socket.to(postId).emit('message', newMessage);

      // Prepare the notification object
      const notification = {
        postId,
        user,
        message,
        authorEmail,
        timestamp: new Date(),
      };

      // Check if the author is connected
      const authorSocketId = userSocketMap.get(authorEmail);
      if (authorSocketId) {
        // Author is connected - send them a notification
        io.to(authorSocketId).emit('notification', notification);
        console.log(`Notification sent to author: ${authorEmail}`);
      } else {
        // Author is not connected - save the notification to the database
        await Author.updateOne(
          { email: authorEmail },
          { $push: { notification: notification } }
        );
        console.log(`Notification saved for offline author: ${authorEmail}`);
      }
    } catch (error) {
      console.error('Error processing new message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    userSocketMap.forEach((id, email) => {
      if (id === socket.id) {
        userSocketMap.delete(email);
        console.log(`User unregistered: ${email}`);
      }
    });
  });
});




// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
module.exports.handler = serverless(app);
