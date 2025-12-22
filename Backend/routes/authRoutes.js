// Import necessary packages
const express = require("express");
const cloudinary = require("cloudinary").v2;

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
const {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateChangePassword,
} = require("../middleware/validationMiddleware");

// Initialize express router
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route for user registration
// This route is used to create a new user account
router.post("/register", validateRegister, handleValidationErrors, registerUser);

// Route for user login
// This route is used to authenticate a user and get a JWT token
router.post("/login", validateLogin, handleValidationErrors, loginUser);

// Route to get user information
// This is a protected route, meaning the user must be authenticated to access it
router.get("/getUser", Protect, getUserInfo);

// Route for changing user password
// This is a protected route
router.post("/change-password", Protect, validateChangePassword, handleValidationErrors, changePassword);

// Routes for 2FA management
router.post("/2fa/enable", Protect, enable2FA);
router.post("/2fa/disable", Protect, disable2FA);
router.get("/2fa/status", Protect, get2FAStatus);
router.post("/2fa/generate-secret", Protect, generate2FASecret);

// Route for uploading a profile image
// This route uses the "upload" middleware to handle the file upload
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No File Uploaded" });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "expense_tracker_uploads",
    },
    (error, result) => {
      if (error) {
        // Log the error for debugging
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({ message: "Failed to upload image", error });
      }
      res.status(200).json({ imageUrl: result.secure_url });
    }
  );

  uploadStream.end(req.file.buffer);
});

// Export the router
module.exports = router;