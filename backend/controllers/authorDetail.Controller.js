const Author = require("../models/blogAuthorSchema");

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

const getAllAuthor = async (req, res) => {
  try {
    const authors = await Author.find({});
    res.json(authors);
  } catch (err) {
    res.send("Error" + err);
  }
};

const getSingleAuthor = async (req, res) => {
  try {
    const author = await Author.findOne({ email: req.params.email });
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.json(author);
  } catch (err) {
    res.send("Error" + err);
  }
};

const addAuthor = async (req, res) => {
  const { authorname, password, email, post } = req.body;
  try {
    const authorExist = await Author.findOne({ email });
    if (authorExist) {
      return res.status(400).json({ message: "Author already exist" });
    }

    const newAuthor = new Author({
      authorname,
      password,
      email,
      post,
    });

    await newAuthor.save();
    res.status(201).json({
      message: "Author created successfully",
      newAuthor,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating author", error: err.message });
  }
};

const updateAuthor = async (req, res) => {
  const { authorname, email } = req.body;
  const profile = req.file ? req.file.originalname : '';
  try {
    const author = await Author.findOne({ email: req.params.email });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

      // S3 Integration
      const params = {
        Bucket:bucketName,
        Key:req.file.originalname,
        Body:req.file.buffer,
        ContentType:req.file.mimetype
      }
  
      const command = new PutObjectCommand(params)
      await s3.send(command)
      console.log("profile data",req.file)

    // Object.assign(post, { title, image, description, category });
    Object.assign(author, {authorname,email,profile});
    data = await author.save();
    res.status(201).json({ message: "author updated successfully", data });

  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const deleteAuthor = async (req, res) => {
  const { email } = req.params;
  try {
    const author = await Author.findOneAndDelete({ email: email });
    if (!author) {
      res.status(404).json({ message: "author Not Exist" });
    }
    res.json({ message: "author deleted successfully", author: author });
  } catch (err) {
    res.send("error" + err);
  }
};
module.exports = {
  addAuthor,
  getAllAuthor,
  getSingleAuthor,
  updateAuthor,
  deleteAuthor,
};
