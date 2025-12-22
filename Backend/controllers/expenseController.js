// Import necessary packages and models
const Expense = require("../models/Expense");
const ExcelJS = require("exceljs");
const mongoose = require("mongoose");

/**
 * @desc    Add a new expense
 * @route   POST /api/v1/expense
 * @access  Private
 */
exports.addExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, icon, amount, category, date, description } = req.body;

    // Basic validation
    if (!title || !amount || !category) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const expense = new Expense({
      user: userId,
      title,
      icon,
      amount,
      category,
      date,
      description,
    });
    await expense.save();




    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation Error", error: err.message });
    }
    res
      .status(500)
      .json({ message: "Error adding expense", error: err.message });
  }
};

/**
 * @desc    Get all expenses for the logged-in user
 * @route   GET /api/v1/expense
 * @access  Private
 */
exports.getAllExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ user: userId })
      .sort({ date: -1 })
      .lean();

    res.status(200).json({ expenses });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching expenses", error: err.message });
  }
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/v1/expense/:id
 * @access  Private
 */
exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    const expense = await Expense.findOneAndDelete({
      _id: mongoose.Types.ObjectId(expenseId),
      user: mongoose.Types.ObjectId(userId),
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }




    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting expense", error: err.message });
  }
};

/**
 * @desc    Update an expense
 * @route   PUT /api/v1/expense/:id
 * @access  Private
 */
exports.updateExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.id;
    const { title, icon, amount, category, date, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }

    const updatePayload = { title, icon, amount, category, date, description };

    const expense = await Expense.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(expenseId), user: mongoose.Types.ObjectId(userId) },
      updatePayload,
      { new: true, runValidators: true },
    );
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }




    res.status(200).json({ message: "Expense updated successfully", expense });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating expense", error: err.message });
  }
};

/**
 * @desc    Download all expenses as an Excel file
 * @route   GET /api/v1/expense/download-excel
 * @access  Private
 */
exports.downloadExpenseExcel = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ user: userId }).lean();
    if (!expenses.length) {
      return res.status(404).json({ message: "No expenses found to export" });
    }

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expenses");

    // Prepare data for Excel by removing unwanted fields
    const data = expenses.map(
      ({ _id, user: _user, __v, createdAt: _createdAt, updatedAt: _updatedAt, note: _note, ...rest }) => ({ ...rest }),
    );

    // Add headers to the worksheet
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      // Add data rows to the worksheet
      data.forEach((expense) => {
        worksheet.addRow(Object.values(expense));
      });
    }

    // Set headers for the response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expenses.xlsx"
    );

    // Write the workbook to the response object
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error exporting expenses", error: err.message });
  }
};