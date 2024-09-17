const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Post schema for blog posts
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false, // Image is optional
  },
  description: {
    type: String,
    required: true,
  },
  category:{
    type:String,
    required:true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
});

// Author schema for storing authors and their posts
const authorSchema = new mongoose.Schema({
  authorname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [emailRegex, 'Please provide a valid email address'] // Ensure each email is unique
  },
  profile:{
    type: String,
    required: false, // Image is optional

  },
  posts: [postSchema], // Array of posts linked to the author
});

// Password encryption before saving the author
authorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password is not modified

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt with a factor of 10
    const hashPassword = await bcrypt.hash(this.password, salt); // Hash the password
    this.password = hashPassword; // Replace the plain password with the hashed one
    next();
  } catch (err) {
    next(new Error('Error hashing password: ' + err)); // Handle any errors during the hashing process
  }
});

// Method to compare passwords during login
authorSchema.methods.comparePassword =  function (enteredPassword) {
  return  bcrypt.compare(enteredPassword, this.password); // Compare entered password with the hashed one
};

// Author model
const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
