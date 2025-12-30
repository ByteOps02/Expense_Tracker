// Import necessary packages and models
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

/**
 * @desc    Generate JWT token
 * @param   {string} id - User ID
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT_SECRET is not defined in environment variables", 500);
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already in use", 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    profileImageUrl,
  });

  res.status(201).json({
    status: "success",
    token: generateToken(user._id),
    data: {
      user,
    },
  });
});

/**
 * @desc    Authenticate a user and get a token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid credentials", 401));
  }

  res.status(200).json({
    status: "success",
    token: generateToken(user._id),
    data: {
      user,
    },
  });
});

/**
 * @desc    Get user information
 * @route   GET /api/v1/auth/getUser
 * @access  Private
 */
exports.getUserInfo = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { user }
  });
});

/**
 * @desc    Update user information
 * @route   PUT /api/v1/auth/update
 * @access  Private
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, profileImageUrl } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { fullName, email, profileImageUrl },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

/**
 * @desc    Change user password
 * @route   POST /api/v1/auth/change-password
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!user || !(await user.comparePassword(currentPassword))) {
    return next(new AppError("Invalid current password", 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password changed successfully"
  });
});

/**
 * @desc    Upload a profile image
 * @route   POST /api/v1/auth/upload-image
 * @access  Private
 */
exports.uploadProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No File Uploaded", 400));
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "expense_tracker_uploads",
    },
    (error, result) => {
      if (error) {
        console.error("Cloudinary Upload Error:", error);
        return next(new AppError("Failed to upload image", 500));
      }
      res.status(200).json({
        status: "success",
        data: {
          imageUrl: result.secure_url
        }
      });
    }
  );

  uploadStream.end(req.file.buffer);
});
    