// Import necessary models
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

/**
 * @desc    Get a summary of dashboard data
 * @route   GET /api/v1/dashboard
 * @access  Private
 */
exports.getDashboardSummary = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [incomeStats, expenseStats] = await Promise.all([
    Income.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          incomeLast30Days: [
            { $match: { date: { $gte: thirtyDaysAgo, $lte: now } } },
            { $sort: { date: -1 } },
          ],
          last5Incomes: [
            { $sort: { date: -1 } },
            { $limit: 5 },
            { $addFields: { type: "income" } },
          ],
          totalIncome: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
          totalIncomeLast30Days: [
            { $match: { date: { $gte: thirtyDaysAgo, $lte: now } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
        },
      },
    ]),
    Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          expenseLast30Days: [
            { $match: { date: { $gte: thirtyDaysAgo, $lte: now } } },
            { $sort: { date: -1 } },
          ],
          last5Expenses: [
            { $sort: { date: -1 } },
            { $limit: 5 },
            { $addFields: { type: "expense" } },
          ],
          totalExpense: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
          totalExpenseLast30Days: [
            { $match: { date: { $gte: thirtyDaysAgo, $lte: now } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
        },
      },
    ]),
  ]);

  const incomeData = incomeStats[0];
  const expenseData = expenseStats[0];

  const last5Transactions = [
    ...(incomeData.last5Incomes || []),
    ...(expenseData.last5Expenses || []),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const totalIncome = incomeData.totalIncome[0]?.total || 0;
  const totalExpense = expenseData.totalExpense[0]?.total || 0;
  const totalIncomeLast30Days =
    incomeData.totalIncomeLast30Days[0]?.total || 0;
  const totalExpenseLast30Days =
    expenseData.totalExpenseLast30Days[0]?.total || 0;
  const balance = totalIncome - totalExpense;

  res.status(200).json({
    status: "success",
    data: {
      // removed allIncomes/allExpenses from response
      incomeLast30Days: incomeData.incomeLast30Days,
      totalIncomeLast30Days,
      expenseLast30Days: expenseData.expenseLast30Days,
      totalExpenseLast30Days,
      last5Transactions,
      balance,
      totalIncome,
      totalExpense,
    },
  });
});


/**
 * @desc    Get total expenses by category for the last 30 days
 * @route   GET /api/v1/dashboard/expense-summary-by-category
 * @access  Private
 */
exports.getDashboardExpenseSummary = asyncHandler(async (req, res, next) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const userId = req.user.id;

    const summary = await Expense.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                date: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: "$category",
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $sort: { totalAmount: -1 }
        }
    ]);

    res.status(200).json({
        status: "success",
        results: summary.length,
        data: {
            summary
        }
    });
});