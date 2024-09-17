const Author = require("../models/blogAuthorSchema");
const path = require('path');

const getAllPosts = async (req, res) => {
  try {
    const authors = await Author.find({}); // fetch all authors
    const allPosts =  authors.flatMap((author) => author.posts.map((post)=>({
      ...post.toObject(), //Conver post to a plain object
      authorname: author.authorname,
      authoremail: author.email,
      profie:author.profile||'',
    }))); // extract posts alone
    res.status(200).json({ message: "All posts", posts: allPosts });
  } catch (err) {
    res.send(500).json({ message: "server error" });
  }
};

const getCategoryPosts = async (req, res) => {
  try {
    // const authors = await Author.find({}); // fetch all authors
    const category = req.params.category;
    const authors = await Author.find({
      'posts.category': category
    });
     // Flatten posts from authors and filter by category
     const categoryPosts = authors.flatMap((author) =>
      author.posts
        .filter((post) => post.category === category)
        .map((post) => ({
          ...post.toObject(), // Convert post to a plain object
          authorname: author.authorname,
          authoremail: author.email,
          profile:author.profile || '',
        }))
    );
    res
      .status(200)
      .json({ message: "Category posts", data: categoryPosts });
  } catch (err) {
    res.send(500).json({ message: "server error" });
  }
};

const addPosts = async (req, res) => {

  const { title, description, category } = req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : ''; // Image path as URL
  
  try {
    const author = await Author.findOne({ email: req.params.email });
    if (!author) {
      return res.status(404).json({ message: "author not found" });
    }

    author.posts.push({ title, image, description, category, });
    data = await author.save();
    res.status(201).json({ message: "post added successfully", data });
  } catch (err) {
    res.status(500).json({ message: "server error", err });
  }
};

const updatePost = async (req, res) => {
  const { email, postId } = req.params;
  const { title, description, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  try {
    const author = await Author.findOne({ email });

    if (!author) {
      return res.status(404).json({ message: "author not found" });
    }
    // const post = author.posts.id(postId);
    const post = author.posts.id(postId);

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    Object.assign(post, { title, image, description, category });

    const updatedAuthor = await author.save();

    res
      .status(200)
      .json({ message: "post updeted successsfully", data: updatedAuthor });
  } catch (err) {
    res.send(500).json({ message: "server error", error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { email, postId } = req.params;

    // Find the author by email
    const author = await Author.findOne({ email });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Find the index of the post by _id within the posts array
    const postIndex = author.posts.findIndex(
      (post) => post._id.toString() === postId
    );

    if (postIndex === -1) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Remove the post from the posts array
    author.posts.splice(postIndex, 1);

    // Save the updated author document
    const updatedAuthor = await author.save();

    res.status(200).json({
      message: "Post deleted successfully",
      data: updatedAuthor,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getSinglePost = async(req,res) =>{
  try {
   const { email, postId } = req.params;

     // Find the author by email
     const author = await Author.findOne({ email });
     if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

     // Find the post by ID within the posts array
     const post = author.posts.id(postId);

     if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

   // Convert post to a plain object and include author details
   const postWithAuthorDetails = {
    ...post.toObject(),
    authorname: author.authorname,
    authoremail: author.email,
    profile: author.profile || '', // Default to an empty string if profile is missing
  };

    // Return the posts along with author details
    res.status(200).json({
      message: "Single post",
      data: postWithAuthorDetails,
    });
  }
  catch (err) {
    // Handle errors and send an appropriate response
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

module.exports = {
  getAllPosts,
  getCategoryPosts,
  addPosts,
  updatePost,
  deletePost,
  getSinglePost,
};
