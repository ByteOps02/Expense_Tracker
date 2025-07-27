const User = require("../models/User");
const Income = require("../models/Income");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { clearCache } = require("../middleware/cacheMiddleware");

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
    
    // Clear dashboard cache when new income is added
    clearCache("dashboard");
    
    res.status(201).json({ message: "Income added successfully", income });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding income", error: err.message });
  }
};

exports.getAllIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    // Use lean() for better performance when full documents aren't needed
    const incomes = await Income.find({ user: userId })
      .sort({ date: -1 })
      .lean();
    res.status(200).json({ incomes });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching incomes", error: err.message });
  }
};

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
    
    // Clear dashboard cache when income is deleted
    clearCache("dashboard");
    
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting income", error: err.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomeId = req.params.id;
    const { icon, amount, source, date, note } = req.body;

    const income = await Income.findOneAndUpdate(
      { _id: incomeId, user: userId },
      { icon, amount, source, date, note },
      { new: true, runValidators: true }
    );

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    
    // Clear dashboard cache when income is updated
    clearCache("dashboard");
    
    res.status(200).json({ message: "Income updated successfully", income });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating income", error: err.message });
  }
};

exports.downloadIncomeExcel = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomes = await Income.find({ user: userId }).lean();
    if (!incomes.length) {
      return res.status(404).json({ message: "No incomes found to export" });
    }
    
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Incomes");
    
    // Prepare data for Excel
    const data = incomes.map(
      ({ _id, user, __v, createdAt, updatedAt, ...rest }) => ({ ...rest })
    );
    
    // Add headers
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);
      
      // Add data rows
      data.forEach(income => {
        worksheet.addRow(Object.values(income));
      });
    }

    // Save the file to the Backend folder
    const filePath = path.join(__dirname, "../incomes.xlsx");
    await workbook.xlsx.writeFile(filePath);

    res
      .status(200)
      .json({ message: "Excel file saved to backend folder", filePath });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error exporting incomes", error: err.message });
  }
};
