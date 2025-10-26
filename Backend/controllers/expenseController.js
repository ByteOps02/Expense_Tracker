// Import necessary packages and models
const Expense = require("../models/Expense");
const ExcelJS = require("exceljs");
const path = require("path");
const { cache, clearCache } = require("../middleware/cacheMiddleware");

/**
 * @desc    Add a new expense
 * @route   POST /api/v1/expense
 * @access  Private
 */
exports.addExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { icon, amount, category, date, note } = req.body;
    const expense = new Expense({
      user: userId,
      icon,
      amount,
      category,
      date,
      note,
    });
    await expense.save();

    // Clear the cache for the dashboard data since it is now stale
    clearCache("dashboard");

    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (err) {
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

    // Check if the data is in the cache
    if (cache.has(userId)) {
      return res.status(200).json({ expenses: cache.get(userId) });
    }

    // If not in cache, fetch from the database
    // Use .lean() for better performance as it returns a plain JavaScript object
    const expenses = await Expense.find({ user: userId })
      .sort({ date: -1 })
      .lean();

    // Store the fetched data in the cache
    cache.set(userId, expenses);

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
    const expense = await Expense.findOneAndDelete({
      _id: expenseId,
      user: userId,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Clear the cache for the dashboard data since it is now stale
    clearCache("dashboard");

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
    const { icon, amount, category, date, note } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: expenseId, user: userId },
      { icon, amount, category, date, note },
      { new: true, runValidators: true },
    );
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Clear the cache for the dashboard data since it is now stale
    clearCache("dashboard");

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
      ({ _id, user, __v, createdAt, updatedAt, ...rest }) => ({ ...rest }),
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

    // Save the Excel file to the backend folder
    const filePath = path.join(__dirname, "../expenses.xlsx");
    await workbook.xlsx.writeFile(filePath);

    res
      .status(200)
      .json({ message: "Excel file saved to backend folder", filePath });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error exporting expenses", error: err.message });
  }
};