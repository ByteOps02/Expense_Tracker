const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { validateEmail, validateObjectId } = require("../utils/queryValidator");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT_SECRET is missing", 500);
  }
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// register user function
exports.registerUser = asyncHandler(async (req, res, next) => {
  let { fullName, email, password, profileImageUrl } = req.body;

  let myEmail = validateEmail(email);

  let userExists = await User.findOne({ email: myEmail });
  if (userExists) {
    return next(new AppError("Email is already used", 400));
  }

  let newUser = await User.create({
    fullName,
    email,
    password,
    profileImageUrl
  });

  res.status(201).json({
    status: "success",
    token: generateToken(newUser._id),
    data: {
      user: newUser,
    },
  });
});

// login user function
exports.loginUser = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;

  // check email
  let myEmail = validateEmail(email);

  let foundUser = await User.findOne({ email: myEmail }).select('+password');
  if (!foundUser || !(await foundUser.comparePassword(password))) {
    return next(new AppError("Wrong email or password", 401));
  }

  res.status(200).json({
    status: "success",
    token: generateToken(foundUser._id),
    data: {
      user: foundUser,
    },
  });
});

// get user info
exports.getUserInfo = asyncHandler(async (req, res, next) => {
  let myUser = await User.findById(req.user.id).select("-password");
  if (!myUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { user: myUser }
  });
});

// update user
exports.updateUser = asyncHandler(async (req, res, next) => {
  let { fullName, email, profileImageUrl } = req.body;

  let uId = validateObjectId(req.user.id, 'User ID');

  let updatedUser = await User.findByIdAndUpdate(
    uId,
    { fullName: fullName, email: email, profileImageUrl: profileImageUrl },
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

// change password function
exports.changePassword = asyncHandler(async (req, res, next) => {
  let { currentPassword, newPassword } = req.body;

  let myUser = await User.findById(req.user.id).select('+password');

  if (!myUser || !(await myUser.comparePassword(currentPassword))) {
    return next(new AppError("Wrong current password", 401));
  }

  myUser.password = newPassword;
  await myUser.save();

  res.status(200).json({
    status: "success",
    message: "Password changed"
  });
});

// upload profile pic
exports.uploadProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload a file", 400));
  }

  let uploadTask = cloudinary.uploader.upload_stream(
    {
      folder: "expense_tracker_uploads",
    },
    (error, result) => {
      if (error) {
        console.error("Cloudinary error:", JSON.stringify(error, null, 2));
        return next(new AppError("Image upload failed", 500));
      }
      res.status(200).json({
        status: "success",
        data: {
          imageUrl: result.secure_url
        }
      });
    }
  );

  uploadTask.end(req.file.buffer);
});