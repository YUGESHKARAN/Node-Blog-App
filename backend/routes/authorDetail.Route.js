const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Author = require("../models/blogAuthorSchema");
const {
  getAllAuthor,
  addAuthor,
  getSingleAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorDetail.Controller");

//handle author data: name, email, password

router.get("/", getAllAuthor);

router.get("/:email", getSingleAuthor);


// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the upload folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, uniqueSuffix+ file.originalname + ext); // Include original extension
  }
});

const upload = multer({ storage });

router.put("/:email",upload.single('profile'), updateAuthor);

router.post("/", addAuthor);

router.delete("/:email", deleteAuthor);

module.exports = router;
