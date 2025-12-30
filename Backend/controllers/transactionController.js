// Import necessary packages and models
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get all transactions (income and expenses) for the logged-in user
 * @route   GET /api/v1/transactions
 * @access  Private
 */
exports.getAllTransactions = asyncHandler(async (req, res, next) => {
  const incomes = await Income.find({ user: req.user.id }).lean();
  const expenses = await Expense.find({ user: req.user.id }).lean();

  const transactions = [...incomes, ...expenses];

  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json({
    status: "success",
    results: transactions.length,
    data: {
      transactions,
    },
  });
});
