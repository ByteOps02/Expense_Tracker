const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { validateEmail, validateObjectId } = require("../utils/queryValidator");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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
    profileImageUrl,
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

  let foundUser = await User.findOne({ email: myEmail }).select("+password");
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
    data: { user: myUser },
  });
});

// update user
exports.updateUser = asyncHandler(async (req, res, next) => {
  let { fullName, email, profileImageUrl } = req.body;

  let uId = validateObjectId(req.user.id, "User ID");

  let updatedUser = await User.findByIdAndUpdate(
    uId,
    { fullName: fullName, email: email, profileImageUrl: profileImageUrl },
    { new: true, runValidators: true },
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

  let myUser = await User.findById(req.user.id).select("+password");

  if (!myUser || !(await myUser.comparePassword(currentPassword))) {
    return next(new AppError("Wrong current password", 401));
  }

  myUser.password = newPassword;
  await myUser.save();

  res.status(200).json({
    status: "success",
    message: "Password changed",
  });
});

// forgot password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  let myEmail = validateEmail(req.body.email);

  const user = await User.findOne({ email: myEmail });

  if (!user) {
    return next(new AppError("There is no user with that email address.", 404));
  }

  // Generate the random reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Your OTP for password reset is: \n\n ${resetToken}`;
  const html = `
    <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
    <p>Your OTP for password reset is:</p>
    <h2>${resetToken}</h2>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
      html,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending the email. Try again later!", 500));
  }
});

// reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, password } = req.body;

  let myEmail = validateEmail(email);

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  const user = await User.findOne({
    email: myEmail,
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("OTP is invalid or has expired", 400));
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password reset successful. Please log in.",
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
          imageUrl: result.secure_url,
        },
      });
    },
  );

  uploadTask.end(req.file.buffer);
});
