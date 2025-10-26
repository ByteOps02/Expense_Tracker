// Import necessary packages
const express = require("express");

// Import middleware and controllers
const { Protect } = require("../middleware/authMiddleware");
const expenseController = require("../controllers/expenseController");

// Initialize express router
const router = express.Router();

// Route to add a new expense
// This is a protected route
router.post("/", Protect, expenseController.addExpense);

// Route to get all expenses for the user
// This is a protected route
router.get("/", Protect, expenseController.getAllExpenses);

// Route to update an existing expense
// This is a protected route
router.put("/:id", Protect, expenseController.updateExpense);

// Route to delete an expense
// This is a protected route
router.delete("/:id", Protect, expenseController.deleteExpense);

// Route to download all expenses as an Excel file
// This is a protected route
router.get("/download-excel", Protect, expenseController.downloadExpenseExcel);

// Export the router
module.exports = router;