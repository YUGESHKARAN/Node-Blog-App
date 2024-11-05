const express = require("express");
const mongoose = require("mongoose");
const PORT = 3000;
const cors = require("cors");
const app = express();
const path = require('path');
const connectToDatabase = require("./db");
// const url =

//   "mongodb+srv://yugeshkaran01:GEMBkFW5Ny5wi4ox@blog.adtwl.mongodb.net/Blog-Data?retryWrites=true&w=majority&appName=blog"

// mongoose.connect(url);
// const con = mongoose.connection;

// con.on("open", () => {
//   console.log("MongoDb connected...");
// });
// Connect to MongoDB once
connectToDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const loginRouter = require('./routes/login.Route') ;
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use("/blog/login",loginRouter) ;

//Create folder[uploads] to store post images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authorRouter = require("./routes/authorDetail.Route");
app.use("/blog/author", authorRouter);

const postRouter = require("./routes/postDetail.Route");
app.use("/blog/posts", postRouter);








app.listen(PORT, () => {
  console.log(`Server connect on ${PORT}`);
});
