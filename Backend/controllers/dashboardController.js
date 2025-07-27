const Income = require("../models/Income");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// GET /api/v1/dashboard/summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjId = new mongoose.Types.ObjectId(userId);
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Single aggregation query to get all required data
    const [incomeStats, expenseStats] = await Promise.all([
      Income.aggregate([
        { $match: { user: userObjId } },
        {
          $facet: {
            allIncomes: [
              { $sort: { date: -1 } }
            ],
            incomeLast60Days: [
              { 
                $match: { 
                  date: { $gte: sixtyDaysAgo, $lte: now } 
                } 
              },
              { $sort: { date: -1 } }
            ],
            last5Incomes: [
              { $sort: { date: -1 } },
              { $limit: 5 },
              { $addFields: { type: "income" } }
            ],
            totalIncome: [
              { $group: { _id: null, total: { $sum: "$amount" } } }
            ],
            totalIncomeLast60Days: [
              { 
                $match: { 
                  date: { $gte: sixtyDaysAgo, $lte: now } 
                } 
              },
              { $group: { _id: null, total: { $sum: "$amount" } } }
            ]
          }
        }
      ]),
      Expense.aggregate([
        { $match: { user: userObjId } },
        {
          $facet: {
            allExpenses: [
              { $sort: { date: -1 } }
            ],
            expenseLast30Days: [
              { 
                $match: { 
                  date: { $gte: thirtyDaysAgo, $lte: now } 
                } 
              },
              { $sort: { date: -1 } }
            ],
            last5Expenses: [
              { $sort: { date: -1 } },
              { $limit: 5 },
              { $addFields: { type: "expense" } }
            ],
            totalExpense: [
              { $group: { _id: null, total: { $sum: "$amount" } } }
            ],
            totalExpenseLast30Days: [
              { 
                $match: { 
                  date: { $gte: thirtyDaysAgo, $lte: now } 
                } 
              },
              { $group: { _id: null, total: { $sum: "$amount" } } }
            ]
          }
        }
      ])
    ]);

    // Extract data from aggregation results
    const incomeData = incomeStats[0];
    const expenseData = expenseStats[0];

    // Combine last 5 transactions and sort by date
    const last5Transactions = [
      ...incomeData.last5Incomes,
      ...expenseData.last5Expenses
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Calculate totals
    const totalIncome = incomeData.totalIncome[0]?.total || 0;
    const totalExpense = expenseData.totalExpense[0]?.total || 0;
    const totalIncomeLast60Days = incomeData.totalIncomeLast60Days[0]?.total || 0;
    const totalExpenseLast30Days = expenseData.totalExpenseLast30Days[0]?.total || 0;
    const balance = totalIncome - totalExpense;

    // Final response
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
    res
      .status(500)
      .json({
        message: "Error fetching dashboard summary",
        error: err.message,
      });
  }
};
