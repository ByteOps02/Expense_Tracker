// Import necessary packages
const express = require("express");

// Import middleware and controllers
const { Protect } = require("../middleware/authMiddleware");
const { getDashboardSummary, getDashboardExpenseSummary } = require("../controllers/dashboardController");

// Initialize express router
const router = express.Router();

// Route to get the dashboard summary data
// This is a protected route
router.get("/", Protect, getDashboardSummary);

// Route to get total expenses by category for the last 30 days
// This is a protected route
router.get("/expense-summary-by-category", Protect, getDashboardExpenseSummary);

// Export the router
module.exports = router;