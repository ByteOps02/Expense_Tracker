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

/**
 * @desc    Get monthly summary data (income, expenses, savings)
 * @route   GET /api/v1/dashboard/monthly-summary?month=2026-04
 * @access  Private
 */
exports.getMonthlyDashboardSummary = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { month } = req.query;

  if (!month) {
    return next(new AppError("Month parameter is required (format: YYYY-MM)", 400));
  }

  // Parse month string (format: YYYY-MM)
  const [year, monthNum] = month.split("-");
  if (!year || !monthNum || isNaN(year) || isNaN(monthNum)) {
    return next(new AppError("Invalid month format. Use YYYY-MM", 400));
  }

  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

  const [incomeStats, expenseStats] = await Promise.all([
    Income.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          monthlyIncomes: [
            { $match: { date: { $gte: startDate, $lte: endDate } } },
            { $sort: { date: -1 } },
            { $addFields: { type: "income" } },
          ],
          totalIncome: [
            { $match: { date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          incomeBySource: [
            { $match: { date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: "$source", totalAmount: { $sum: "$amount" } } },
            { $sort: { totalAmount: -1 } },
          ],
        },
      },
    ]),
    Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $facet: {
          monthlyExpenses: [
            { $match: { date: { $gte: startDate, $lte: endDate } } },
            { $sort: { date: -1 } },
            { $addFields: { type: "expense" } },
          ],
          totalExpense: [
            { $match: { date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          expenseByCategory: [
            { $match: { date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
            { $sort: { totalAmount: -1 } },
          ],
        },
      },
    ]),
  ]);

  const incomeData = incomeStats[0];
  const expenseData = expenseStats[0];

  const totalIncome = incomeData.totalIncome[0]?.total || 0;
  const totalExpense = expenseData.totalExpense[0]?.total || 0;
  const totalSavings = totalIncome - totalExpense;
  const transactionCount = (incomeData.monthlyIncomes?.length || 0) + (expenseData.monthlyExpenses?.length || 0);

  const monthlyTransactions = [
    ...(incomeData.monthlyIncomes || []),
    ...(expenseData.monthlyExpenses || []),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json({
    status: "success",
    data: {
      month,
      totalIncome,
      totalExpense,
      totalSavings,
      transactionCount,
      monthlyTransactions,
      incomeBySource: incomeData.incomeBySource || [],
      expenseByCategory: expenseData.expenseByCategory || [],
    },
  });
});

/**
 * @desc    Get monthly expenses data with pagination
 * @route   GET /api/v1/dashboard/monthly-expenses?month=2026-04&page=1&limit=10
 * @access  Private
 */
exports.getMonthlyExpenses = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { month, page = 1, limit = 20 } = req.query;

  if (!month) {
    return next(new AppError("Month parameter is required (format: YYYY-MM)", 400));
  }

  const [year, monthNum] = month.split("-");
  if (!year || !monthNum || isNaN(year) || isNaN(monthNum)) {
    return next(new AppError("Invalid month format. Use YYYY-MM", 400));
  }

  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const [expenses, totalCount] = await Promise.all([
    Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Expense.countDocuments({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }),
  ]);

  res.status(200).json({
    status: "success",
    results: expenses.length,
    totalCount,
    totalPages: Math.ceil(totalCount / limitNum),
    currentPage: pageNum,
    data: {
      expenses,
    },
  });
});

/**
 * @desc    Get monthly income data with pagination
 * @route   GET /api/v1/dashboard/monthly-income?month=2026-04&page=1&limit=10
 * @access  Private
 */
exports.getMonthlyIncome = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { month, page = 1, limit = 20 } = req.query;

  if (!month) {
    return next(new AppError("Month parameter is required (format: YYYY-MM)", 400));
  }

  const [year, monthNum] = month.split("-");
  if (!year || !monthNum || isNaN(year) || isNaN(monthNum)) {
    return next(new AppError("Invalid month format. Use YYYY-MM", 400));
  }

  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const [incomes, totalCount] = await Promise.all([
    Income.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Income.countDocuments({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }),
  ]);

  res.status(200).json({
    status: "success",
    results: incomes.length,
    totalCount,
    totalPages: Math.ceil(totalCount / limitNum),
    currentPage: pageNum,
    data: {
      incomes,
    },
  });
});

/**
 * @desc    Get 12-month summary data (income, expenses, savings, transactions) for trend charts
 * @route   GET /api/v1/dashboard/trend-summary?month=2026-04
 * @access  Private
 */
exports.getTrendSummary = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { month } = req.query;

  if (!month) {
    return next(new AppError("Month parameter is required (format: YYYY-MM)", 400));
  }

  const [year, monthNum] = month.split("-");
  if (!year || !monthNum || isNaN(year) || isNaN(monthNum)) {
    return next(new AppError("Invalid month format. Use YYYY-MM", 400));
  }

  // Parse month string and set date to 1st of selected month
  const currentDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);

  // Generate range: 11 months ago to current month
  const startDate = new Date(currentDate);
  startDate.setMonth(startDate.getMonth() - 11);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);

  const [incomeStats, expenseStats] = await Promise.all([
    Income.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalIncome: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
    ]),
    Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalExpense: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  // Create lookup maps
  const incomeMap = {};
  incomeStats.forEach((item) => {
    const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
    incomeMap[key] = item;
  });

  const expenseMap = {};
  expenseStats.forEach((item) => {
    const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
    expenseMap[key] = item;
  });

  // Generate sequence of 12 months chronologically
  const trendData = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const key = `${y}-${m}`;

    const inc = incomeMap[key]?.totalIncome || 0;
    const exp = expenseMap[key]?.totalExpense || 0;
    const incCount = incomeMap[key]?.transactionCount || 0;
    const expCount = expenseMap[key]?.transactionCount || 0;

    trendData.push({
      month: key,
      monthDisplay: d.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      }),
      income: inc,
      expense: exp,
      savings: inc - exp,
      transactions: incCount + expCount,
    });
  }

  res.status(200).json({
    status: "success",
    data: trendData,
  });
});