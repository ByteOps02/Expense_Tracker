const multer = require("multer");

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// Initialize multer with memory storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format. Only JPEG, PNG, and JPG are allowed."), false);
    }
  },
});

module.exports = upload;
