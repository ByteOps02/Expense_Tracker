// Import necessary packages and models
const Income = require("../models/Income");
const ExcelJS = require("exceljs");
const path = require("path");

/**
 * @desc    Add a new income
 * @route   POST /api/v1/income
 * @access  Private
 */
exports.addIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const { icon, amount, source, date, note } = req.body;
    const income = new Income({
      user: userId,
      icon,
      amount,
      source,
      date,
      note,
    });
    await income.save();

    // Clear the cache for the dashboard data since it is now stale


    res.status(201).json({ message: "Income added successfully", income });
  } catch (err) {
    res.status(500).json({ message: "Error adding income", error: err.message });
  }
};

/**
 * @desc    Get all incomes for the logged-in user
 * @route   GET /api/v1/income
 * @access  Private
 */
exports.getAllIncome = async (req, res) => {
  try {
    const userId = req.user.id;

    const incomes = await Income.find({ user: userId })
      .sort({ date: -1 })
      .lean();

    res.status(200).json({ incomes });
  } catch (err) {
    res.status(500).json({ message: "Error fetching incomes", error: err.message });
  }
};

/**
 * @desc    Delete an income
 * @route   DELETE /api/v1/income/:id
 * @access  Private
 */
exports.deleteIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomeId = req.params.id;
    const income = await Income.findOneAndDelete({
      _id: incomeId,
      user: userId,
    });
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    // Clear the cache for the dashboard data since it is now stale


    res.status(200).json({ message: "Income deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting income", error: err.message });
  }
};

/**
 * @desc    Update an income
 * @route   PUT /api/v1/income/:id
 * @access  Private
 */
exports.updateIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomeId = req.params.id;
    const { icon, amount, source, date, note } = req.body;

    const income = await Income.findOneAndUpdate(
      { _id: incomeId, user: userId },
      { icon, amount, source, date, note },
      { new: true, runValidators: true },
    );

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    // Clear the cache for the dashboard data since it is now stale


    res.status(200).json({ message: "Income updated successfully", income });
  } catch (err) {
    res.status(500).json({ message: "Error updating income", error: err.message });
  }
};

/**
 * @desc    Download all incomes as an Excel file
 * @route   GET /api/v1/income/download-excel
 * @access  Private
 */
exports.downloadIncomeExcel = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomes = await Income.find({ user: userId }).lean();
    if (!incomes.length) {
      return res.status(404).json({ message: "No incomes found to export" });
    }

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Incomes");

    // Prepare data for Excel by removing unwanted fields
    const data = incomes.map(
      ({ _id, user: _user, __v, createdAt: _createdAt, updatedAt: _updatedAt, ...rest }) => ({ ...rest }),
    );

    // Add headers to the worksheet
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      // Add data rows to the worksheet
      data.forEach((income) => {
        worksheet.addRow(Object.values(income));
      });
    }

    // Save the Excel file to the backend folder
    const filePath = path.join(__dirname, "../incomes.xlsx");
    await workbook.xlsx.writeFile(filePath);

    res
      .status(200)
      .json({ message: "Excel file saved to backend folder", filePath });
  } catch (err) {
    res.status(500).json({ message: "Error exporting incomes", error: err.message });
  }
};