const express = require("express");
const rateLimit = require("express-rate-limit");
const { Protect } = require("../middleware/authMiddleware");
const { 
  getDashboardSummary, 
  getDashboardExpenseSummary,
  getMonthlyDashboardSummary,
  getMonthlyExpenses,
  getMonthlyIncome,
  getTrendSummary
} = require("../controllers/dashboardController");

const router = express.Router();

// Rate limiter for dashboard endpoints
const dashboardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 100000 : 1000, // Relaxed for dev, 1000 for prod
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

// Route to get monthly dashboard summary
// This is a protected route
// Query parameter: month (format: YYYY-MM)
router.get("/monthly-summary", Protect, getMonthlyDashboardSummary);

// Route to get 12-month trend summary
// This is a protected route
// Query parameter: month (format: YYYY-MM)
router.get("/trend-summary", Protect, getTrendSummary);

// Route to get monthly expenses
// This is a protected route
// Query parameters: month (format: YYYY-MM), page, limit
router.get("/monthly-expenses", Protect, getMonthlyExpenses);

// Route to get monthly income
// This is a protected route
// Query parameters: month (format: YYYY-MM), page, limit
router.get("/monthly-income", Protect, getMonthlyIncome);

// Export the router
module.exports = router;