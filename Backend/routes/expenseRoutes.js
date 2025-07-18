const express = require("express");
const { Protect } = require("../middleware/authMiddleware");
const expenseController = require("../controllers/expenseController");
const router = express.Router();

router.post("/add", Protect, expenseController.addExpense);
router.post("/", Protect, expenseController.addExpense);
router.get("/", Protect, expenseController.getAllExpenses);
router.get("/get", Protect, expenseController.getAllExpenses);
router.put("/:id", Protect, expenseController.updateExpense);
router.delete("/:id", Protect, expenseController.deleteExpense);
router.get("/download-excel", Protect, expenseController.downloadExpenseExcel);

module.exports = router;
