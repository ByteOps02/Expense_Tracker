// Import necessary packages and models
const Expense = require("../models/Expense");
const ExcelJS = require("exceljs");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

/**
 * @desc    Add a new expense
 * @route   POST /api/v1/expense
 * @access  Private
 */
exports.addExpense = asyncHandler(async (req, res, next) => {
  const { title, icon, amount, category, date, description } = req.body;

  const expense = await Expense.create({
    user: req.user.id,
    title,
    icon,
    amount,
    category,
    date,
    description,
  });

  res.status(201).json({
    status: "success",
    data: {
      expense,
    },
  });
});

/**
 * @desc    Get all expenses for the logged-in user
 * @route   GET /api/v1/expense
 * @access  Private
 */
exports.getAllExpenses = asyncHandler(async (req, res, next) => {
  const expenses = await Expense.find({ user: req.user.id })
    .sort({ date: -1 })
    .lean();

  res.status(200).json({
    status: "success",
    results: expenses.length,
    data: {
      expenses,
    },
  });
});

/**
 * @desc    Delete an expense
 * @route   DELETE /api/v1/expense/:id
 * @access  Private
 */
exports.deleteExpense = asyncHandler(async (req, res, next) => {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!expense) {
    return next(new AppError("No expense found with that ID for this user", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

/**
 * @desc    Update an expense
 * @route   PUT /api/v1/expense/:id
 * @access  Private
 */
exports.updateExpense = asyncHandler(async (req, res, next) => {
  const { title, icon, amount, category, date, description } = req.body;

  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { title, icon, amount, category, date, description },
    { new: true, runValidators: true },
  );

  if (!expense) {
    return next(new AppError("No expense found with that ID for this user", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      expense,
    },
  });
});

/**
 * @desc    Download all expenses as an Excel file
 * @route   GET /api/v1/expense/download-excel
 * @access  Private
 */
exports.downloadExpenseExcel = asyncHandler(async (req, res, next) => {
  const expenses = await Expense.find({ user: req.user.id }).lean();
  if (!expenses.length) {
    return next(new AppError("No expenses found to export", 404));
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Expenses");

  const data = expenses.map(
    ({ _id, user, __v, createdAt, updatedAt, ...rest }) => rest
  );

  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
    data.forEach((expense) => {
      worksheet.addRow(Object.values(expense));
    });
  }

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=expenses.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});