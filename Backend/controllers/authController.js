// Import necessary packages and models
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");

/**
 * @desc    Generate JWT token
 * @param   {string} id - User ID
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  // Basic validation to check for missing fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create a new user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    // Respond with user data and a JWT token
    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

/**
 * @desc    Authenticate a user and get a token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation to check for missing fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Respond with user data and a JWT token
    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

/**
 * @desc    Get user information
 * @route   GET /api/v1/auth/getUser
 * @access  Private
 */
exports.getUserInfo = async (req, res) => {
  try {
    // Find the user by ID from the token and exclude the password
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user data
    res.status(200).json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user info", error: err.message });
  }
};

/**
 * @desc    Change user password
 * @route   POST /api/v1/auth/change-password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Basic validation
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current password and new password are required" });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Update password
    user.password = newPassword; // Mongoose pre-save hook will hash this
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error changing password", error: err.message });
  }
};

/**
 * @desc    Get 2FA status
 * @route   GET /api/v1/auth/2fa/status
 * @access  Private
 */
exports.get2FAStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ is2FAEnabled: user.is2FAEnabled });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching 2FA status", error: err.message });
  }
};

/**
 * @desc    Enable 2FA
 * @route   POST /api/v1/auth/2fa/enable
 * @access  Private
 */
exports.enable2FA = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.twoFASecret) {
      // Generate a new secret if one doesn't exist
      const secret = speakeasy.generateSecret({ length: 20 });
      user.twoFASecret = secret.base32;
      await user.save();
    }

    // Verify the token provided by the user
    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token: token,
    });

    if (verified) {
      user.is2FAEnabled = true;
      await user.save();
      res.status(200).json({ message: "2FA enabled successfully" });
    } else {
      res.status(400).json({ message: "Invalid 2FA token" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error enabling 2FA", error: err.message });
  }
};

/**
 * @desc    Disable 2FA
 * @route   POST /api/v1/auth/2fa/disable
 * @access  Private
 */
exports.disable2FA = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the token provided by the user
    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token: token,
    });

    if (verified) {
      user.is2FAEnabled = false;
      user.twoFASecret = null; // Clear the secret
      await user.save();
      res.status(200).json({ message: "2FA disabled successfully" });
    } else {
      res.status(400).json({ message: "Invalid 2FA token" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error disabling 2FA", error: err.message });
  }
};

/**
 * @desc    Generate 2FA secret and QR code
 * @route   POST /api/v1/auth/2fa/generate-secret
 * @access  Private
 */
exports.generate2FASecret = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new secret if one doesn't exist or if 2FA is currently disabled
    if (!user.twoFASecret || !user.is2FAEnabled) {
      const secret = speakeasy.generateSecret({ length: 20 });
      user.twoFASecret = secret.base32;
      await user.save();
    }

    const qrCodeImageUrl = speakeasy.otpauthURL({
      secret: user.twoFASecret,
      issuer: "ExpenseTracker",
      label: user.email,
      encoding: "base32",
    });

    res.status(200).json({ secret: user.twoFASecret, qrCodeImageUrl });
  } catch (err) {
    res.status(500).json({ message: "Error generating 2FA secret", error: err.message });
  }
};