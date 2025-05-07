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

const getProfile = async (req,res) => {
  try {
    const authorsProfile = await Author.find({});
    const data = authorsProfile.map(author=>({
      authorName:author.authorname,
      email:author.email,
      postCount:author.posts.length,
      profile:author.profile,
      followers:author.followers
    }))
    res.json(data);
  }
  catch(err)
  {
    res.send("Error",err)
  }
}

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
  if(!email.endsWith('@dsuniversity.ac.in'))
  {
    return res.status(400).json({message:"Use university email"})
  }
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

    
      if(req.file)
      {
          // S3 Integration
      const params = {
        Bucket:bucketName,
        Key:profile,
        Body:req.file.buffer,
        ContentType:req.file.mimetype
      }
  
      const command = new PutObjectCommand(params)
        await s3.send(command)
        author.profile = profile; 
      }
      console.log("profile data",req.file)

    // Object.assign(post, { title, image, description, category });
    author.authorname =authorname;
    author.email = email;
    data = await author.save();
    res.status(201).json({ message: "author updated successfully", data });

  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};


const updateAPassword = async (req, res) => {
  const { password } = req.body;
  const { email } = req.params;  // Email is passed via the URL parameters

  try {
    // Find the author by email
    const author = await Author.findOne({ email });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Update the author's password
    author.password = password;

    // Save the updated author object
    const data = await author.save();

    // Return a success message with status 200
    res.status(200).json({ message: "Password updated successfully", data });

  } catch (err) {
    // Handle server errors
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Server error" });
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


const updateFollowers = async (req, res) => {
  try {
    const { email } = req.params; // The author being followed/unfollowed
    const { emailAuthor } = req.body; // The follower's email

    // Find both authors
    const author = await Author.findOne({ email });
    const followerAuthor = await Author.findOne({ email: emailAuthor });

    if (!author || !followerAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // If already following, unfollow
    if (author.followers.includes(emailAuthor)) {
      author.followers = author.followers.filter(follower => follower !== emailAuthor);
      followerAuthor.following = followerAuthor.following.filter(following => following !== email);

      await author.save();
      await followerAuthor.save();

      return res.status(200).json({
        message: 'Unfollowed successfully',
        followers: author.followers,
        following: followerAuthor.following,
      });
    }

    // If not following, follow
    author.followers.push(emailAuthor);
    followerAuthor.following.push(email);

    await author.save();
    await followerAuthor.save();

    return res.status(200).json({
      message: 'Author followed successfully',
      followers: author.followers,
      following: followerAuthor.following,
    });

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// otp
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

const sendOtp = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await Author.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, {  digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false,specialChars: false });
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yugeshkaran01@gmail.com', // Replace with your email
        pass: 'scwj nztr szjx ysdw' // Replace with your email password
      }
    });

    const mailOptions = {
      from: 'yugeshkaran01@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It is valid for 15 minutes.`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error });
  }
};

// reset password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await Author.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid
    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update password
    user.password = newPassword; // Hash the password in real implementations
    user.otp = null; // Clear OTP
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
};

const notificationAuthor = async(req,res)=>{
  const { email } = req.body;
  try{
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.json({ notifications: author.notification });
  }
  catch(err)
  {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const notificationAuthorDelete = async (req, res) => {
  const { email, notificationId } = req.query; // Expecting `notificationId` to identify which notification to delete.

  try {
    // Find the author by email
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Filter out the notification with the given notificationId
    const updatedNotifications = author.notification.filter(
      (notif) =>  notif._id.toString()!== notificationId
    );

    // If no notification matches the provided ID
    if (updatedNotifications.length === author.notification.length) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Update the author's notifications and save
    author.notification = updatedNotifications;
    await author.save();

    res.json({
      message: 'Notification deleted successfully',
      notifications: author.notification,
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const notificationAuthorDeleteAll = async (req, res) => {
  const { email } = req.query; // Expecting the author's email in the request body.

  try {
    // Find the author by email
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Set the notifications array to empty
    author.notification = [];
    await author.save();

    res.json({
      message: 'All notifications deleted successfully',
      notifications: author.notification, // This will now be an empty array
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// user: {
//   type: String,
//   required: true,
// },
// title: {
//   type: String,
//   required: true,
// },
// link:{
// type: [String],
// default: []
// },
// deliveredTo:{
// enum: ['all',"community",'coordinators'],
// default: 'coordinators'
// },
// message: {
//   type: String,
//   required: true,
// },
// profile:{
//   type:String,
//   required:false
// },
// authorEmail: {
//   type: String,
//   required: true,
// },


const addAnnouncement = async (req, res) => {
  const { user, title, message, links, deliveredTo,email} = req.body; // Title and description from the request body
  const profile = req.file ? req.file.originalname : ''; // Image from the uploaded file

  try {
    // Find the author by email
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    if(req.file)
      {
          // S3 Integration
      const params = {
        Bucket:bucketName,
        Key:req.file.originalname,
        Body:req.file.buffer,
        ContentType:req.file.mimetype
      }
  
      const command = new PutObjectCommand(params)
        await s3.send(command)
      }
   const parsedLinks = links ? JSON.parse(links) : [];
    // Create a new announcement object
    const newAnnouncement = {
      user: user,
      title:title,
      message: message,
      links: parsedLinks,
      deliveredTo:deliveredTo,
      profile: profile,
      authorEmail:email
    };
  
    let filter = {};
    if (deliveredTo === 'coordinators') {
      filter.role = 'coordinator';
    }

    // Find all matching authors
    const recipients = await Author.find(filter);

    // Push announcement to each recipient
    for (const recipient of recipients) {
      recipient.announcement = recipient.announcement || [];
      recipient.announcement.push(newAnnouncement);
      await recipient.save();
    }

    // res.status(201).json({
    //   message: 'Announcement added successfully',
    //   announcement: newAnnouncement,
    //   deliveredTo: filter.role || 'all'
    // });


    res.status(201).json({
      message: 'Announcement added successfully',
      announcement: newAnnouncement,
    });
  } catch (error) {
    console.error('Error adding announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  addAuthor,
  getAllAuthor,
  getSingleAuthor,
  updateAuthor,
  updateAPassword,
  deleteAuthor,
  getProfile,
  updateFollowers,
  sendOtp,
  resetPassword,
  notificationAuthor,
  notificationAuthorDelete,
  notificationAuthorDeleteAll,
  addAnnouncement
};
