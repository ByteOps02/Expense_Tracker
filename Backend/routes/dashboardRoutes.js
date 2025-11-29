// Import necessary packages
const express = require("express");

// Import middleware and controllers
const { Protect } = require("../middleware/authMiddleware");
const { getDashboardSummary, getRecentActivities } = require("../controllers/dashboardController");

// Initialize express router
const router = express.Router();

// Route to get the dashboard summary data
// This is a protected route
router.get("/", Protect, getDashboardSummary);

// Route to get recent login activities
// This is a protected route
router.get("/recent-activities", Protect, getRecentActivities);

// Export the router
module.exports = router;