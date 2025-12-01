// Import necessary packages
const express = require("express");

// Import middleware and controllers
const { Protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserInfo,
  changePassword,
  enable2FA,
  disable2FA,
  get2FAStatus,
  generate2FASecret,
} = require("../controllers/authController");
const upload = require("../middleware/uploadMiddleware");

// Initialize express router
const router = express.Router();

// Route for user registration
// This route is used to create a new user account
router.post("/register", registerUser);

// Route for user login
// This route is used to authenticate a user and get a JWT token
router.post("/login", loginUser);

// Route to get user information
// This is a protected route, meaning the user must be authenticated to access it
router.get("/getUser", Protect, getUserInfo);

// Route for changing user password
// This is a protected route
router.post("/change-password", Protect, changePassword);

// Routes for 2FA management
router.post("/2fa/enable", Protect, enable2FA);
router.post("/2fa/disable", Protect, disable2FA);
router.get("/2fa/status", Protect, get2FAStatus);
router.post("/2fa/generate-secret", Protect, generate2FASecret);

// Route for uploading a profile image
// This route uses the "upload" middleware to handle the file upload
// Note: This route is public to allow users to upload profile pictures during sign-up
router.post("/upload-image", upload.single("image"), (req, res) => {
  // If no file is uploaded, return an error
  if (!req.file) {
    return res.status(400).json({ message: "No File Uploaded" });
  }
  // Return the image URL from Cloudinary
  res.status(200).json({ imageUrl: req.file.path });
});

// Export the router
module.exports = router;