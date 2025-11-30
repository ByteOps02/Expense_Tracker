const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "expense_tracker_uploads", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed file formats
  },
});

// Initialize multer with the Cloudinary storage
const upload = multer({ storage: storage });

// Export the upload middleware
module.exports = upload;