// Import necessary packages and models
const User = require("../models/User");
const base64url = require("base64url");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {
  generateAttestation,
  verifyAttestation,
  verifyAssertion,
} = require("../utils/webauthn");

/**
 * @desc    Generate JWT token
 * @param   {string} id - User ID
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

/**
 * @desc    Get all passkeys for the logged-in user
 * @route   GET /api/v1/biometric/passkeys
 * @access  Private
 */
exports.getPasskeys = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ passkeys: user.authenticators });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a passkey
 * @route   DELETE /api/v1/biometric/passkeys/:id
 * @access  Private
 */
exports.deletePasskey = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Filter out the passkey to be deleted
    user.authenticators = user.authenticators.filter(
      (authr) => authr.credID !== req.params.id,
    );
    await user.save();
    res.status(200).json({ message: "Passkey deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Generate attestation options for registering a new passkey
 * @route   POST /api/v1/biometric/attestation/options
 * @access  Private
 */
exports.generateAttestationOptions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const attestationOptions = generateAttestation(user);

    // Store the challenge and user ID in the session for later verification
    req.session.challenge = attestationOptions.challenge;
    req.session.userId = user.id;

    res.status(200).json(attestationOptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Verify the attestation response and save the new passkey
 * @route   POST /api/v1/biometric/attestation/result
 * @access  Private
 */
exports.verifyAttestationResponse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the attestation response
    const verification = verifyAttestation(
      req.body.attestationResponse,
      req.session.challenge,
    );

    if (verification.verified) {
      // If verification is successful, save the new authenticator
      user.authenticators.push(verification.authr);
      await user.save();
      res.status(200).json({ verified: true });
    } else {
      res.status(400).json({ message: "Verification failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Generate assertion options for authenticating with a passkey
 * @route   POST /api/v1/biometric/assertion/options
 * @access  Public
 */
exports.generateAssertionOptions = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || user.authenticators.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no passkeys registered" });
    }

    // Generate assertion options
    const assertionOptions = {
      challenge: base64url.encode(crypto.randomBytes(32)),
      allowCredentials: user.authenticators.map((authr) => ({
        type: "public-key",
        id: authr.credID,
      })),
      userVerification: "required",
    };

    // Store the challenge and email in the session for later verification
    req.session.challenge = assertionOptions.challenge;
    req.session.email = req.body.email;

    res.status(200).json(assertionOptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Verify the assertion response and log the user in
 * @route   POST /api/v1/biometric/assertion/result
 * @access  Public
 */
exports.verifyAssertionResponse = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the authenticator that matches the credential ID
    const authr = user.authenticators.find(
      (authr) => authr.credID === req.body.id,
    );

    if (!authr) {
      return res.status(404).json({ message: "Authenticator not found" });
    }

    // Verify the assertion response
    const verification = verifyAssertion(
      req.body,
      req.session.challenge,
      authr,
    );

    if (verification.verified) {
      // If verification is successful, generate a JWT token and log the user in
      const token = generateToken(user._id);
      res.status(200).json({ verified: true, user, token });
    } else {
      res.status(400).json({ message: "Verification failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};