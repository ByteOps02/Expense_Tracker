// Import necessary packages
const express = require("express");

// Import middleware and controllers
const { Protect } = require("../middleware/authMiddleware");
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  updateIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");

// Initialize express router
const router = express.Router();

// Route to add a new income
// This is a protected route
router.post("/", Protect, addIncome);

// Route to get all incomes for the user
// This is a protected route
router.get("/", Protect, getAllIncome);

// Route to update an existing income
// This is a protected route
router.put("/:id", Protect, updateIncome);

// Route to delete an income
// This is a protected route
router.delete("/:id", Protect, deleteIncome);

// Route to download all incomes as an Excel file
// This is a protected route
router.get("/download-excel", Protect, downloadIncomeExcel);

// Export the router
module.exports = router;