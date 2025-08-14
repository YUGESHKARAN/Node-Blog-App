const Author = require("../models/blogAuthorSchema");
const path = require('path');

const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const mongoose = require("mongoose");

const sharp = require('sharp');
dotenv = require("dotenv");
dotenv.config();
// import nodemailer from "nodemailer";

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER, // Or your preferred email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});


// s3 integration
const { S3Client,PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { link } = require("fs");
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



const getAllPosts = async (req, res) => {
  try {
    const authors = await Author.find({}); // fetch all authors
    const allPosts =  authors.flatMap((author) => author.posts.map((post)=>({
      ...post.toObject(), //Conver post to a plain object
      authorname: author.authorname,
      authoremail: author.email,
      profie:author.profile||'',
      role:author.role, 
      community:author.community,
      
    }))); // extract posts alone

       // Calculate category counts
     const categoryCounts = authors.flatMap((author) =>
      author.posts.map((post) => post.category)
    ).reduce((counts, category) => {
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    }, {});
    

    const count = Object.keys(categoryCounts).length

    res.status(200).json({ message: "All posts", posts: allPosts,count});
  } catch (err) {
    res.status(500).json({ message: "server error" });
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
    res.status(500).json({ message: "server error" });
  }
};


// const addPosts = async (req, res) => {
//   const { title, description, category, links } = req.body;
  
//   const author = await Author.findOne({ email: req.params.email });

//   try {
//     if (!author) {
//       return res.status(404).json({ message: "Author not found" });
//     }

//     let imageUrl = '';
//     if (req.files && req.files.image) {
//       const buffer = await sharp(req.files.image[0].buffer)
//         .resize({ width: 672, height: 462, fit: 'contain' })
//         .toBuffer();

//       const params = {
//         Bucket: bucketName,
//         Key: req.files.image[0].originalname,
//         Body: buffer,
//         ContentType: req.files.image[0].mimetype
//       };

//       const command = new PutObjectCommand(params);
//       await s3.send(command);
//       imageUrl = req.files.image[0].originalname;
//     }

//     const documentUrls = [];
//     if (req.files && req.files.document) {
//       for (const doc of req.files.document) {
//         const params = {
//           Bucket: bucketName,
//           Key: doc.originalname,
//           Body: doc.buffer,
//           ContentType: doc.mimetype
//         };

//         const command = new PutObjectCommand(params);
//         await s3.send(command);
//         documentUrls.push(doc.originalname);
//       }
//     }

//     // Parse links from form data
//     const parsedLinks = links ? JSON.parse(links) : [];
//     console.log("parsedLinks", parsedLinks);

//     // Create a new post
//     const postId = new mongoose.Types.ObjectId(); // Generate a unique ID for the post
//     author.posts.push({
//       _id: postId,
//       title,
//       image: imageUrl,
//       description,
//       category,
//       documents: documentUrls,
//       links: parsedLinks
//     });

  

//     // 🌟 **Re-add the notification system**
//     const url = `https://blog-frontend-teal-ten.vercel.app/viewpage/${author.email}/${postId}`;

//   // Find community authors (excluding self)
//     const communityAuthors = await Author.find({
//       community: { $in: author.community },
//       email: { $ne: author.email }
//     }).select('email');

//     // Prepare sets
//     const followerSet = new Set(author.followers);
//     const communitySet = new Set();

//     for (const a of communityAuthors) {
//       if (!followerSet.has(a.email)) {
//         communitySet.add(a.email);
//       }
//     }

//     const combinedRecipients = [...followerSet, ...communitySet];

//     const bulkNotifications = combinedRecipients.map(email => {
//       const isFollower = followerSet.has(email);
//       const message = isFollower
//         ? `New post from ${author.authorname}: ${title}`
//         : `${author.authorname} from your community posted: ${title}`;

//       const notification = {
//         postId,
//         user: author.authorname,
//         authorEmail: author.email,
//         message,
//         url,
//         profile: author.profile || ""
//       };

//       return {
//         updateOne: {
//           filter: { email },
//           update: { $push: { notification } }
//         }
//       };
//     });

//     if (bulkNotifications.length > 0) {
//       await Author.bulkWrite(bulkNotifications);
//     }

//     const data = await author.save();

//     res.status(201).json({ message: "Post added successfully", data });

//     // 🌟 Send email to all recipients
//     if (combinedRecipients.length > 0) {
//       const emailSubject = `New post from ${author.authorname}`;
//       const emailHtml = `
//         <h3>${author.authorname} has posted a new blog!</h3>
//         <p><strong>Title:</strong> ${title}</p>
//         <p>${description}</p>
//         <p><a href="${url}">Click here to view the post</a></p>
//       `;

//       for (const recipient of combinedRecipients) {
//         await transporter.sendMail({
//           from: `"${author.authorname}" <${process.env.EMAIL_USER}>`,
//           to: recipient,
//           subject: emailSubject,
//           html: emailHtml
//         });
//       }
//     }


//     // const data = await author.save();

//     // res.status(201).json({ message: "Post added successfully", data });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//     console.log(err)
//   }
// };

const addPosts = async (req, res) => {
  const { title, description, category, links } = req.body;

  try {
    const author = await Author.findOne({ email: req.params.email });
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // --- Upload image ---
    let imageUrl = '';
    if (req.files?.image?.length) {
      const buffer = await sharp(req.files.image[0].buffer)
        .resize({ width: 672, height: 462, fit: 'contain' })
        .toBuffer();

      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: req.files.image[0].originalname,
        Body: buffer,
        ContentType: req.files.image[0].mimetype
      }));

      imageUrl = req.files.image[0].originalname;
    }

    // --- Upload documents ---
    const documentUrls = [];
    if (req.files?.document?.length) {
      for (const doc of req.files.document) {
        await s3.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: doc.originalname,
          Body: doc.buffer,
          ContentType: doc.mimetype
        }));
        documentUrls.push(doc.originalname);
      }
    }

    // --- Parse links safely ---
    let parsedLinks = [];
    try {
      parsedLinks = links ? JSON.parse(links) : [];
    } catch {
      parsedLinks = [];
    }

    // --- Create post ---
    const postId = new mongoose.Types.ObjectId();
    author.posts.push({
      _id: postId,
      title,
      image: imageUrl,
      description,
      category,
      documents: documentUrls,
      links: parsedLinks
    });

    const url = `https://blog-frontend-teal-ten.vercel.app/viewpage/${author.email}/${postId}`;

    // --- Find community authors (excluding self) ---
    const communityAuthors = await Author.find({
      community: { $in: author.community },
      email: { $ne: author.email }
    }).select('email');

    const followerSet = new Set(author.followers);
    const communitySet = new Set();

    for (const a of communityAuthors) {
      if (!followerSet.has(a.email)) {
        communitySet.add(a.email);
      }
    }

    // --- Combined recipients (followers + non-following community members) ---
    const combinedRecipients = [...followerSet, ...communitySet];
    const followersSet = [...followerSet]

    // --- Bulk notifications ---
    if (combinedRecipients.length > 0) {
      const bulkNotifications = combinedRecipients.map(email => {
        const isFollower = followerSet.has(email);
        const message = isFollower
          ? `New post from ${author.authorname}: ${title}`
          : `${author.authorname} from your community posted: ${title}`;

        return {
          updateOne: {
            filter: { email },
            update: {
              $push: {
                notification: {
                  postId,
                  user: author.authorname,
                  authorEmail: author.email,
                  message,
                  url,
                  profile: author.profile || ""
                }
              }
            }
          }
        };
      });
      await Author.bulkWrite(bulkNotifications);
    }

    // --- Save post ---
    const data = await author.save();

    // ✅ Respond immediately (non-blocking email sending)
    res.status(201).json({ message: "Post added successfully", data });

    // --- Send emails in background ---
    if (followersSet.length > 0) {
      const sendEmailsSequentially = async (recipients, subject, html) => {
        for (const recipient of recipients) {
          try {
            await transporter.sendMail({
              from: `"${author.authorname}" <${process.env.EMAIL_USER}>`,
              to: recipient,
              subject,
              html
            });
            console.log(`📧 Email sent to ${recipient}`);
            await new Promise(res => setTimeout(res, 200)); // short delay
          } catch (err) {
            console.error(`❌ Failed to send email to ${recipient}:`, err.message);
          }
          
        }
         console.log("📬 All emails processed.");
      };

      sendEmailsSequentially(
        followersSet,
        `New post from ${author.authorname}`,
        `
          <h3>${author.authorname} has posted a new blog!</h3>
          <p><strong>Title:</strong> ${title}</p>
          <p>${description}</p>
          <p><a href="${url}">Click here to view the post</a></p>
        `
      );
    }

  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const updatePost = async (req, res) => {
  const { email, postId } = req.params;
  const { title, description, category,links } = req.body;
  console.log("new changes", req.body)

  
  try {
    const author = await Author.findOne({ email });

    if (!author) {
      return res.status(404).json({ message: "author not found" });
    }

    const post = author.posts.id(postId);

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    // Handle image upload
    let imageUrl = post.image ||[];
    if (req.files && req.files.image) {
      const buffer = await sharp(req.files.image[0].buffer)
        .resize({ width: 672, height: 462, fit: 'contain' })
        .toBuffer();

      const params = {
        Bucket: bucketName,
        Key: req.files.image[0].originalname,
        Body: buffer,
        ContentType: req.files.image[0].mimetype
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);
      imageUrl = req.files.image[0].originalname;
    }

    console.log("image",imageUrl)

    // Handle document uploads
    let documentUrls =post.documents || [];
    if (req.files && req.files.document) {
      documentUrls = [];
      for (const doc of req.files.document) {
        const params = {
          Bucket: bucketName,
          Key: doc.originalname,
          Body: doc.buffer,
          ContentType: doc.mimetype
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);
        documentUrls.push(doc.originalname);
      }
    }

  console.log("old link", post.links);

let parsedLinks = post.links;

// if (links && JSON.parse(links).length > 0) {
//   parsedLinks = Array.isArray(links) ? links : JSON.parse(links);
// }
//  else if (post.links && post.links.length > 0) {
//   parsedLinks = post.links;
// }
if (links && JSON.parse(links).length > 0) {
  try {
    const parsed = typeof links === "string" ? JSON.parse(links) : links;

    if (Array.isArray(parsed)) {
      parsedLinks = parsed.map(link => ({
        _id: new mongoose.Types.ObjectId(), // manually create if you want explicit IDs
        title: (link.title || "").trim(),
        url: (link.url || "").trim()
      }));
    }
  } catch (err) {
    console.error("Failed to parse links:", err);
  }
}
console.log("links",parsedLinks)
    // Update post details
    Object.assign(post, { 
      title, 
      image: imageUrl, 
      description, 
      category,
      documents: documentUrls,
      links:parsedLinks
    });

    const updatedPost = await author.save();

    res.status(200).json({ 
      message: "Post updated successfully", 
      data: updatedPost 
    });
  } catch (err) {
    console.error(err.errors); 
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
};
// const deletePost = async (req, res) => {
//   try {
//     const { email, postId } = req.params;

//     // Find the author by email
//     const author = await Author.findOne({ email });

//     if (!author) {
//       return res.status(404).json({ message: "Author not found" });
//     }

//     // Find the index of the post by _id within the posts array
//     const postIndex = author.posts.findIndex(
//       (post) => post._id.toString() === postId
//     );
//     const postToDelete  = author.posts[postIndex].image;
//     console.log('post to delete',postToDelete)

//     // if (postIndex === -1) {
//     //   return res.status(404).json({ message: "Post not found" });
//     // }

//     // const postToDelete  = author.posts[postIndex]
    
//        // S3 Integration
//        const params = {
//         Bucket:bucketName,
//         Key:postToDelete
//       }
   
//       const command = new DeleteObjectCommand(params)
//       await s3.send(command)
//       console.log(postToDelete)
 
//     // Remove the post from the posts array
//      author.posts.splice(postIndex, 1);

//     // Save the updated author document
//     const updatedAuthor = await author.save();

//     res.status(200).json({
//       message: "Post deleted successfully",
//       data: updatedAuthor,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const deletePost = async (req, res) => {   
  try {
    const { email, postId } = req.params;

    const author = await Author.findOne({ email });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    const postIndex = author.posts.findIndex(
      (post) => post._id.toString() === postId
    );

    const postToDelete = author.posts[postIndex];

    // Delete image from S3
    if (postToDelete.image) {
      await s3.send(new DeleteObjectCommand({
        Bucket: bucketName,
        Key: postToDelete.image
      }));
    }

    // Delete documents from S3 (including PDFs)
    if (postToDelete.documents && postToDelete.documents.length > 0) {
      const documentDeletePromises = postToDelete.documents.map(doc => 
        s3.send(new DeleteObjectCommand({
          Bucket: bucketName,
          Key: doc
        }))
      );
      await Promise.all(documentDeletePromises);
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

const postView = async (req, res) => {
  try {
    const { email, id } = req.params; // Retrieve email and post ID from URL params
    const { emailAuthor } = req.body; // Retrieve emailAuthor from the body

    // Find the author by email
    const author = await Author.findOne({ email });

    // If author doesn't exist, send a 404 error
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Find the specific post by ID in the author's posts array
    const post = author.posts.find(post => post._id.toString() === id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the emailAuthor is already in the views array of the post
    if (post.views.includes(emailAuthor)) {
      return 
    }

    // Add the emailAuthor to the views array
    post.views.push(emailAuthor);

    // Save the updated author document with the post's updated views array
    await author.save();

    // Respond with success and the updated views array
    return res.status(200).json({
      message: 'View added successfully',
      views: post.views,
    });
  } catch (err) {
    // If there is a server error, return a 500 error
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const postLikes = async (req, res) => {
  try {
    const { email, id } = req.params; // Retrieve email and post ID from URL params
    const { emailAuthor } = req.body; // Retrieve emailAuthor from the body

    // Find the author by email
    const author = await Author.findOne({ email });

    // If author doesn't exist, send a 404 error
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Find the specific post by ID in the author's posts array
    const post = author.posts.find(post => post._id.toString() === id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the emailAuthor is already in the views array of the post
    if (post.likes.includes(emailAuthor)) {
      post.likes = post.likes.filter(like => like !== emailAuthor);
      await author.save();
      return res.status(200).json({
        message: 'like removed successfully',
        likes: post.likes,
      });
    }

    // Add the emailAuthor to the views array
    post.likes.push(emailAuthor);

    // Save the updated author document with the post's updated views array
    await author.save();

    // Respond with success and the updated views array
    return res.status(200).json({
      message: 'like added successfully',
      views: post.views,
    });
  } catch (err) {
    // If there is a server error, return a 500 error
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};





module.exports = {
  getAllPosts,
  getCategoryPosts,
  addPosts,
  updatePost,
  deletePost,
  getSinglePost,
  postView,
  postLikes
 
};
