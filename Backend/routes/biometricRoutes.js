// Import necessary packages
const express = require("express");
const router = express.Router();

// Import controllers and middleware
const {
  generateAttestationOptions,
  verifyAttestationResponse,
  generateAssertionOptions,
  verifyAssertionResponse,
  getPasskeys,
  deletePasskey,
} = require("../controllers/biometricController");
const { Protect } = require("../middleware/authMiddleware");

// Route to generate attestation options for registering a new passkey
// This is a protected route
router.post("/attestation/options", Protect, generateAttestationOptions);

// Route to verify the attestation response and save the new passkey
// This is a protected route
router.post("/attestation/result", Protect, verifyAttestationResponse);

// Route to generate assertion options for authenticating with a passkey
router.post("/assertion/options", generateAssertionOptions);

// Route to verify the assertion response and log the user in
router.post("/assertion/result", verifyAssertionResponse);

// Route to get all registered passkeys for the user
// This is a protected route
router.get("/passkeys", Protect, getPasskeys);

// Route to delete a passkey
// This is a protected route
router.delete("/passkeys/:id", Protect, deletePasskey);

// Export the router
module.exports = router;