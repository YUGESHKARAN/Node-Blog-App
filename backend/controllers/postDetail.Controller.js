const Author = require("../models/blogAuthorSchema");
const path = require('path');

const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

const sharp = require('sharp');

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

  const image = req.file ? req.file.originalname : ''; // Image path as URL
  
  try {
    const author = await Author.findOne({ email: req.params.email });
    if (!author) {
      return res.status(404).json({ message: "author not found" });
    }

    // resizeing the image
    const buffer = await sharp(req.file.buffer).resize({width:672,height:462,fit:'contain'}).toBuffer()
     // S3 Integration
     const params = {
      Bucket:bucketName,
      Key:req.file.originalname,
      Body:buffer,
      ContentType:req.file.mimetype
    }

    const command = new PutObjectCommand(params)
    await s3.send(command)
    console.log("post data",req.file)

    author.posts.push({ title, image, description, category, });
     
    data = await author.save();
    res.status(201).json({ message: "post added successfully", data });
  } catch (err) {
    res.status(500).json({ message: "server error", err });
  }
 };
 
//  const addPosts = async (req, res) => {
//   const { title, description, category,links} = req.body;
//   try {
//     const author = await Author.findOne({ email: req.params.email });
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
//     console.log("parsedLinks",parsedLinks)  

//     // Add post to the author's posts array
//     const postId = new mongoose.Types.ObjectId();
//     author.posts.push({
//       _id:postId,
//       title,
//       image: imageUrl,
//       description,
//       category,
//       documents: documentUrls,
//       links: parsedLinks
//     });

//     const data = await author.save();
//     const url = `https://blog-frontend-teal-ten.vercel.app/viewpage/${author.authorEmail}/${postId}`;

//     const notification = {
//       postId:postId,
//       user:author.authorname,
//       email: author.authorEmail,
//       message:`New post from ${author.authorname}: ${title}`,
//       url:url,
//       profile:author.profile || ""
    
//     };

   
//       // Update notifications for all followers
//       await Author.updateMany(
//         { email: { $in: author.followers } },
//         { $push: { notifications: notification } }
//       );

//     res.status(201).json({ message: "Post added successfully", data });
//   } catch (err) {
//     console.error("Error adding post:", err);  // Log full error
//     res.status(500).json({ message: "Server error", error: err.message });
// }
// };





// const updatePost = async (req, res) => {
//   const { email, postId } = req.params;
//   const { title, description, category } = req.body;
//   const image = req.file ? req.file.originalname : '';
  
//   try {
//     const author = await Author.findOne({ email });

//     if (!author) {
//       return res.status(404).json({ message: "author not found" });
//     }
//     // const post = author.posts.id(postId);
//     const post = author.posts.id(postId);

//     if (!post) {
//       return res.status(404).json({ message: "post not found" });
//     }

//     Object.assign(post, { title, image, description, category });


//   if(req.file)
//   {
//     const buffer = await sharp(req.file.buffer).resize({width:672,height:462,fit:'contain'}).toBuffer()
//     if(image!=='')
//     {
//       // s3 Integration
//     const params = {
//       Bucket:bucketName,
//       Key:req.file.originalname,
//       Body:buffer,
//       ContentType:req.file.mimetype
//     }

//     const command = new PutObjectCommand(params)
//     await s3.send(command)
//     console.log("Updated data",req.file)
//     }
//   }

//     const updatedPost = await author.save();

//     res
//       .status(200)
//       .json({ message: "post updeted successsfully", data: updatedPost });
//   } catch (err) {
//     res.send(500).json({ message: "server error", error: err.message });
//   }
// };

const updatePost = async (req, res) => {
  const { email, postId } = req.params;
  const { title, description, category,links } = req.body;
  
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

    // Handle document uploads
    const documentUrls = [];
    if (req.files && req.files.document) {
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
const parsedLinks = links? JSON.parse(links):[];
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
