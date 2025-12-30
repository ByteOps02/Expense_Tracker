// Import necessary packages
const express = require("express");

// Import middleware and controllers
const { Protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserInfo,
  changePassword,
  uploadProfileImage,
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

// Route for uploading a profile image
// This route uses the "upload" middleware to handle the file upload
router.post("/upload-image", upload.single("image"), uploadProfileImage);

// Export the router
module.exports = router;