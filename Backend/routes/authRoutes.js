// Import necessary packages
const express = require("express");

// Import middleware and controllers
const { Protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserInfo,
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

// Route for uploading a profile image
// This route uses the "upload" middleware to handle the file upload
router.post("/upload-image", upload.single("image"), (req, res) => {
  // If no file is uploaded, return an error
  if (!req.file) {
    return res.status(400).json({ message: "No File Uploaded" });
  }
  // Construct the image URL
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  // Return the image URL in the response
  res.status(200).json({ imageUrl });
});

// Export the router
module.exports = router;