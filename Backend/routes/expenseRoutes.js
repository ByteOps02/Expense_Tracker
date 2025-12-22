// Import necessary packages
const express = require("express");
const rateLimit = require("express-rate-limit");

// Import middleware and controllers
const { Protect } = require("../middleware/authMiddleware");
const expenseController = require("../controllers/expenseController");
const {
  handleValidationErrors,
  validateExpense,
  validateMongoId,
} = require("../middleware/validationMiddleware");

// Initialize express router
const router = express.Router();

// Rate limiter for expense endpoints
const expenseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit to 30 requests per windowMs per IP
  message: "Too many requests to expense endpoints, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all routes
router.use(expenseLimiter);

// Route to add a new expense
// This is a protected route
router.post("/", Protect, validateExpense, handleValidationErrors, expenseController.addExpense);

// Route to get all expenses for the user
// This is a protected route
router.get("/", Protect, expenseController.getAllExpenses);

// Route to update an existing expense
// This is a protected route
router.put("/:id", Protect, validateMongoId, validateExpense, handleValidationErrors, expenseController.updateExpense);

// Route to delete an expense
// This is a protected route
router.delete("/:id", Protect, validateMongoId, handleValidationErrors, expenseController.deleteExpense);

// Route to download all expenses as an Excel file
// This is a protected route
router.get("/download-excel", Protect, expenseController.downloadExpenseExcel);

// Export the router
module.exports = router;