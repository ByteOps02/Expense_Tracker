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
  const { page, limit, startDate, endDate } = req.query;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const query = { user: req.user.id };

  // Date filtering
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // OPTIMIZATION: Instead of fetching ALL, we fetch just enough from BOTH
  // collections to ensure we can build the correct sorted page.
  // We fetch (skip + limit) from both because we don't know the distribution.
  // Then we slice the correct window in memory.
  // NOTE: For very deep pagination (e.g. page 1000), this is still slow. 
  // But for "Load More" (page 1, 2, 3), it's drastically faster.
  
  const fetchLimit = skip + limitNum;

  const [incomes, expenses] = await Promise.all([
    Income.find(query).sort({ date: -1 }).limit(fetchLimit).lean(),
    Expense.find(query).sort({ date: -1 }).limit(fetchLimit).lean()
  ]);

  const formattedIncomes = incomes.map(income => ({ ...income, type: 'income' }));
  const formattedExpenses = expenses.map(expense => ({ ...expense, type: 'expense' }));

  // Merge and Sort
  const allTransactions = [...formattedIncomes, ...formattedExpenses];
  allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Apply Pagination Slice
  const paginatedTransactions = allTransactions.slice(skip, skip + limitNum);

  // Calculate total documents for metadata (optional, slightly expensive but good for UX)
  // For infinite scroll, we might just check if result < limit
  const [totalIncome, totalExpense] = await Promise.all([
      Income.countDocuments(query),
      Expense.countDocuments(query)
  ]);
  const total = totalIncome + totalExpense;

  res.status(200).json({
    status: "success",
    results: paginatedTransactions.length,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
    data: {
      transactions: paginatedTransactions,
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
