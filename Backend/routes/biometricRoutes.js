
const express = require("express");
const router = express.Router();
const {
  generateAttestationOptions,
  verifyAttestationResponse,
  generateAssertionOptions,
  verifyAssertionResponse,
  getPasskeys,
  deletePasskey,
} = require("../controllers/biometricController");
const { Protect } = require("../middleware/authMiddleware");

router.post("/attestation/options", Protect, generateAttestationOptions);
router.post("/attestation/result", Protect, verifyAttestationResponse);
router.post("/assertion/options", generateAssertionOptions);
router.post("/assertion/result", verifyAssertionResponse);
router.get("/passkeys", Protect, getPasskeys);
router.delete("/passkeys/:id", Protect, deletePasskey);

module.exports = router;
