// Import necessary packages
const multer = require("multer");

// Configure multer storage
const storage = multer.diskStorage({
  // Set the destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // Set the filename for uploaded files
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configure multer file filter
const fileFilter = (req, file, cb) => {
  // Define the allowed file types
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  // Check if the uploaded file's mimetype is in the allowedTypes array
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg and .png formats are allowed"), false);
  }
};

// Initialize multer with the storage and fileFilter configurations
const upload = multer({ storage, fileFilter });

// Export the upload middleware
module.exports = upload;