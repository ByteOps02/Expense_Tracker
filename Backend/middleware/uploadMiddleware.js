const multer = require("multer");
const storage = multer.memoryStorage();

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
