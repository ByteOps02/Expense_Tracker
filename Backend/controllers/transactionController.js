// Import necessary packages and models
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");
const ExcelJS = require("exceljs");

/**
 * @desc    Get all transactions (income and expenses) for the logged-in user
 * @route   GET /api/v1/transactions
 * @access  Private
 */
exports.getAllTransactions = asyncHandler(async (req, res, next) => {
  const incomes = await Income.find({ user: req.user.id }).lean();
  const expenses = await Expense.find({ user: req.user.id }).lean();

  const formattedIncomes = incomes.map(income => ({ ...income, type: 'income' }));
  const formattedExpenses = expenses.map(expense => ({ ...expense, type: 'expense' }));

  const transactions = [...formattedIncomes, ...formattedExpenses];

  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json({
    status: "success",
    results: transactions.length,
    data: {
      transactions,
    },
  });
});

/**
 * @desc    Download all transactions (income and expenses) for the logged-in user as an Excel file
 * @route   GET /api/v1/transactions/download-excel
 * @access  Private
 */
exports.downloadTransactionsExcel = asyncHandler(async (req, res, next) => {
  const incomes = await Income.find({ user: req.user.id }).lean();
  const expenses = await Expense.find({ user: req.user.id }).lean();

  const transactions = [...incomes, ...expenses];

  // Sort transactions by date
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Transactions");

  // Define columns
  worksheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Type", key: "type", width: 10 },
    { header: "Category/Source", key: "categorySource", width: 25 },
    { header: "Description", key: "description", width: 30 },
    { header: "Amount", key: "amount", width: 15 },
  ];

  // Add rows
  transactions.forEach((transaction) => {
    const type = transaction.source ? "Income" : "Expense";
    const categorySource = transaction.source || transaction.category;
    worksheet.addRow({
      date: new Date(transaction.date).toLocaleDateString(),
      type: type,
      categorySource: categorySource,
      description: transaction.description,
      amount: transaction.amount,
    });
  });

  // Set response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "transactions.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});
