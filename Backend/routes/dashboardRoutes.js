const express = require("express");
const { Protect } = require("../middleware/authMiddleware");
const { cacheMiddleware } = require("../middleware/cacheMiddleware");
const { getDashboardSummary } = require("../controllers/dashboardController");
const router = express.Router();

// Add caching for dashboard summary (5 minutes cache)
router.get("/summary", Protect, cacheMiddleware(300), getDashboardSummary);
router.get("/", Protect, cacheMiddleware(300), getDashboardSummary);

module.exports = router;
