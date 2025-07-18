const express = require("express");
const { Protect } = require("../middleware/authMiddleware");
const { getDashboardSummary } = require("../controllers/dashboardController");
const router = express.Router();
router.get("/summary", Protect, getDashboardSummary);
router.get("/", Protect, getDashboardSummary);
module.exports = router;
