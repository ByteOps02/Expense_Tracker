const Income = require("../models/Income");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// GET /api/v1/dashboard/summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjId = new mongoose.Types.ObjectId(userId);
    const now = new Date();

    // All incomes and expenses
    const [allIncomes, allExpenses] = await Promise.all([
      Income.find({ user: userObjId }).sort({ date: -1 }),
      Expense.find({ user: userObjId }).sort({ date: -1 }),
    ]);

    // Income transactions in last 60 days
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(now.getDate() - 60);
    const incomeLast60Days = await Income.find({
      user: userObjId,
      date: { $gte: sixtyDaysAgo, $lte: now },
    }).sort({ date: -1 });
    const totalIncomeLast60Days = incomeLast60Days.reduce(
      (sum, i) => sum + i.amount,
      0
    );

    // Expense transactions in last 30 days
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const expenseLast30Days = await Expense.find({
      user: userObjId,
      date: { $gte: thirtyDaysAgo, $lte: now },
    }).sort({ date: -1 });
    const totalExpenseLast30Days = expenseLast30Days.reduce(
      (sum, e) => sum + e.amount,
      0
    );

    // Last 5 transactions (income + expenses, sorted by date desc)
    const last5Incomes = await Income.find({ user: userObjId })
      .sort({ date: -1 })
      .limit(5)
      .lean();
    const last5Expenses = await Expense.find({ user: userObjId })
      .sort({ date: -1 })
      .limit(5)
      .lean();
    const last5Transactions = [
      ...last5Incomes.map((i) => ({ ...i, type: "income" })),
      ...last5Expenses.map((e) => ({ ...e, type: "expense" })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Calculate balance (total income - total expense)
    const totalIncome = allIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = allExpenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;

    // Final response
    res.status(200).json({
      allIncomes,
      allExpenses,
      incomeLast60Days,
      totalIncomeLast60Days,
      expenseLast30Days,
      totalExpenseLast30Days,
      last5Transactions,
      balance,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error fetching dashboard summary",
        error: err.message,
      });
  }
};
