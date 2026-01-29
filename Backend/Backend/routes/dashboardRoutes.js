const express = require("express");
const rateLimit = require("express-rate-limit");
const { Protect } = require("../middleware/authMiddleware");
const { getDashboardSummary, getDashboardExpenseSummary } = require("../controllers/dashboardController");

const router = express.Router();

// Rate limiter for dashboard endpoints
const dashboardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit to 30 requests per windowMs per IP
  message: "Too many requests to dashboard endpoints, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all routes
router.use(dashboardLimiter);

// Route to get the dashboard summary data
// This is a protected route
router.get("/", Protect, getDashboardSummary);

// Route to get total expenses by category for the last 30 days
// This is a protected route
router.get("/expense-summary-by-category", Protect, getDashboardExpenseSummary);

// Export the router
module.exports = router;