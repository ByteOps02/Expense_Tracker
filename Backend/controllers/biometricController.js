
const User = require("../models/User");
const base64url = require("base64url");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {
  generateAttestation,
  verifyAttestation,
  verifyAssertion,
} = require("../utils/webauthn");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

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

exports.deletePasskey = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.authenticators = user.authenticators.filter(
      (authr) => authr.credID !== req.params.id
    );
    await user.save();
    res.status(200).json({ message: "Passkey deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateAttestationOptions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const attestationOptions = generateAttestation(user);

    req.session.challenge = attestationOptions.challenge;
    req.session.userId = user.id;

    res.status(200).json(attestationOptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyAttestationResponse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verification = verifyAttestation(
      req.body.attestationResponse,
      req.session.challenge
    );

    if (verification.verified) {
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

exports.generateAssertionOptions = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || user.authenticators.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no passkeys registered" });
    }

    const assertionOptions = {
      challenge: base64url.encode(crypto.randomBytes(32)),
      allowCredentials: user.authenticators.map((authr) => ({
        type: "public-key",
        id: authr.credID,
      })),
      userVerification: "required",
    };

    req.session.challenge = assertionOptions.challenge;
    req.session.email = req.body.email;

    res.status(200).json(assertionOptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyAssertionResponse = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const authr = user.authenticators.find(
      (authr) => authr.credID === req.body.id
    );

    if (!authr) {
      return res.status(404).json({ message: "Authenticator not found" });
    }

    const verification = verifyAssertion(
      req.body,
      req.session.challenge,
      authr
    );

    if (verification.verified) {
      const token = generateToken(user._id);
      res.status(200).json({ verified: true, user, token });
    } else {
      res.status(400).json({ message: "Verification failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
