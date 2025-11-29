// Import necessary models
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const User = require("../models/User"); // Import User model
const mongoose = require("mongoose");

/**
 * @desc    Get a summary of dashboard data
 * @route   GET /api/v1/dashboard
 * @access  Private
 */
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjId = new mongoose.Types.ObjectId(userId);
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Use Promise.all to run aggregation queries in parallel for better performance
    const [incomeStats, expenseStats] = await Promise.all([
      // Aggregation pipeline for income data
      Income.aggregate([
        { $match: { user: userObjId } },
        {
          $facet: {
            allIncomes: [{ $sort: { date: -1 } }],
            incomeLast60Days: [
              {
                $match: {
                  date: { $gte: sixtyDaysAgo, $lte: now },
                },
              },
              { $sort: { date: -1 } },
            ],
            last5Incomes: [
              { $sort: { date: -1 } },
              { $limit: 5 },
              { $addFields: { type: "income" } },
            ],
            totalIncome: [
              { $group: { _id: null, total: { $sum: "$amount" } } },
            ],
            totalIncomeLast60Days: [
              {
                $match: {
                  date: { $gte: sixtyDaysAgo, $lte: now },
                },
              },
              { $group: { _id: null, total: { $sum: "$amount" } } },
            ],
          },
        },
      ]),
      // Aggregation pipeline for expense data
      Expense.aggregate([
        { $match: { user: userObjId } },
        {
          $facet: {
            allExpenses: [{ $sort: { date: -1 } }],
            expenseLast30Days: [
              {
                $match: {
                  date: { $gte: thirtyDaysAgo, $lte: now },
                },
              },
              { $sort: { date: -1 } },
            ],
            last5Expenses: [
              { $sort: { date: -1 } },
              { $limit: 5 },
              { $addFields: { type: "expense" } },
            ],
            totalExpense: [
              { $group: { _id: null, total: { $sum: "$amount" } } },
            ],
            totalExpenseLast30Days: [
              {
                $match: {
                  date: { $gte: thirtyDaysAgo, $lte: now },
                },
              },
              { $group: { _id: null, total: { $sum: "$amount" } } },
            ],
          },
        },
      ]),
    ]);

    // Extract data from the aggregation results
    const incomeData = incomeStats[0];
    const expenseData = expenseStats[0];

    // Combine the last 5 income and expense transactions and sort them by date
    const last5Transactions = [
      ...incomeData.last5Incomes,
      ...expenseData.last5Expenses,
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Calculate total income, total expense, and balance
    const totalIncome = incomeData.totalIncome[0]?.total || 0;
    const totalExpense = expenseData.totalExpense[0]?.total || 0;
    const totalIncomeLast60Days =
      incomeData.totalIncomeLast60Days[0]?.total || 0;
    const totalExpenseLast30Days =
      expenseData.totalExpenseLast30Days[0]?.total || 0;
    const balance = totalIncome - totalExpense;

    // Send the final response
    res.status(200).json({
      allIncomes: incomeData.allIncomes,
      allExpenses: expenseData.allExpenses,
      incomeLast60Days: incomeData.incomeLast60Days,
      totalIncomeLast60Days,
      expenseLast30Days: expenseData.expenseLast30Days,
      totalExpenseLast30Days,
      last5Transactions,
      balance,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching dashboard summary",
      error: err.message,
    });
  }
};

/**
 * @desc    Get recent login activities
 * @route   GET /api/v1/dashboard/recent-activities
 * @access  Private
 */
exports.getRecentActivities = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("recentLoginActivities");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ activities: user.recentLoginActivities.sort((a, b) => b.timestamp - a.timestamp) });
  } catch (err) {
    res.status(500).json({ message: "Error fetching recent activities", error: err.message });
  }
};