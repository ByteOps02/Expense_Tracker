// Import necessary packages and models
const Income = require("../models/Income");
const ExcelJS = require("exceljs");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { validateObjectId } = require("../utils/queryValidator");

/**
 * @desc    Add a new income
 * @route   POST /api/v1/income
 * @access  Private
 */
exports.addIncome = asyncHandler(async (req, res, next) => {
  const { title, icon, amount, source, date, note } = req.body;

  const income = await Income.create({
    user: req.user.id,
    title,
    icon,
    amount,
    source,
    date,
    note,
  });

  res.status(201).json({
    status: "success",
    data: {
      income,
    },
  });
});

/**
 * @desc    Get all incomes for the logged-in user
 * @route   GET /api/v1/income
 * @access  Private
 */
exports.getAllIncome = asyncHandler(async (req, res, next) => {
  const incomes = await Income.find({ user: req.user.id })
    .sort({ date: -1 })
    .lean();

  res.status(200).json({
    status: "success",
    results: incomes.length,
    data: {
      incomes,
    },
  });
});

/**
 * @desc    Delete an income
 * @route   DELETE /api/v1/income/:id
 * @access  Private
 */
exports.deleteIncome = asyncHandler(async (req, res, next) => {
  // Validate income ID and user ID
  const incomeId = validateObjectId(req.params.id, 'Income ID');
  const userId = validateObjectId(req.user.id, 'User ID');
  
  const income = await Income.findOneAndDelete({
    _id: incomeId,
    user: userId,
  });

  if (!income) {
    return next(new AppError("No income found with that ID for this user", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

/**
 * @desc    Update an income
 * @route   PUT /api/v1/income/:id
 * @access  Private
 */
exports.updateIncome = asyncHandler(async (req, res, next) => {
  const { title, icon, amount, source, date, note } = req.body;
  
  // Validate income ID and user ID
  const incomeId = validateObjectId(req.params.id, 'Income ID');
  const userId = validateObjectId(req.user.id, 'User ID');

  const income = await Income.findOneAndUpdate(
    { _id: incomeId, user: userId },
    { title, icon, amount, source, date, note },
    { new: true, runValidators: true },
  );

  if (!income) {
    return next(new AppError("No income found with that ID for this user", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      income,
    },
  });
});

/**
 * @desc    Download all incomes as an Excel file
 * @route   GET /api/v1/income/download-excel
 * @access  Private
 */
exports.downloadIncomeExcel = asyncHandler(async (req, res, next) => {
  const incomes = await Income.find({ user: req.user.id }).lean();
  if (!incomes.length) {
    return next(new AppError("No incomes found to export", 404));
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Incomes");

  const data = incomes.map(
    ({ _id, user, __v, createdAt, updatedAt, ...rest }) => rest
  );

  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
    data.forEach((income) => {
      worksheet.addRow(Object.values(income));
    });
  }

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=incomes.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});