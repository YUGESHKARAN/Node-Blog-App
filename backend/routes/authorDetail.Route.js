const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getAllAuthor,
  addAuthor,
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
  addAnnouncement,
  deleteAnnouncement,
  updateRole,
  updateTechCommunity,
  updateTechCommunityCoordinator
  
} = require("../controllers/authorDetail.Controller");

//handle author data: name, email, password

router.get("/", getAllAuthor);
router.get("/profiles",getProfile);
router.get("/:email", getSingleAuthor);


// // Multer setup for file upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Set the upload folder
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname); // Get the file extension
//     cb(null, uniqueSuffix+ file.originalname + ext); // Include original extension
//   }
// });
// Configure memory storage
const storage = multer.memoryStorage();

const upload = multer({ storage });

router.put("/:email",upload.single('profile'), updateAuthor);
router.put("/password/:email", updateAPassword);

router.post("/", addAuthor);

router.put("/follow/:email",updateFollowers);

router.delete("/:email", deleteAuthor);
router.post('/send-otp', sendOtp);
router.post('/reset-password', resetPassword);
router.get('/notification',notificationAuthor);
router.delete('/notification/delete',notificationAuthorDelete);
router.delete('/notification/deleteall',notificationAuthorDeleteAll);


router.post("/announcement/add",upload.none(),addAnnouncement);
router.delete('/announcements/:announcementId', deleteAnnouncement);
router.put("/control/updateRole",upload.none(),updateRole);
router.put("/control/updateCommunity",updateTechCommunity);
router.put("/control/coordinatorUpdate",updateTechCommunityCoordinator);

module.exports = router;
