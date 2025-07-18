const User = require("../models/User");
const Income = require("../models/Income");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

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
    const incomes = await Income.find({ user: userId }).sort({ date: -1 });
    res.status(200).json({ incomes });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching incomes", error: err.message });
  }
};

exports.deletIncome = async (req, res) => {
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
    // Prepare data for Excel
    const data = incomes.map(
      ({ _id, user, __v, createdAt, updatedAt, ...rest }) => ({ ...rest })
    );
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Incomes");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Save the file to the Backend folder
    const filePath = path.join(__dirname, "../incomes.xlsx");
    fs.writeFileSync(filePath, buffer);

    res
      .status(200)
      .json({ message: "Excel file saved to backend folder", filePath });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error exporting incomes", error: err.message });
  }
};
