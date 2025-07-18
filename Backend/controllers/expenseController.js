const User = require("../models/User");
const Expense = require("../models/Expense");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

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
    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding expense", error: err.message });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
    res.status(200).json({ expenses });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching expenses", error: err.message });
  }
};

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
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting expense", error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.id;
    const { icon, amount, category, date, note } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: expenseId, user: userId },
      { icon, amount, category, date, note },
      { new: true, runValidators: true }
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

exports.downloadExpenseExcel = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ user: userId }).lean();
    if (!expenses.length) {
      return res.status(404).json({ message: "No expenses found to export" });
    }
    // Prepare data for Excel
    const data = expenses.map(
      ({ _id, user, __v, createdAt, updatedAt, ...rest }) => ({ ...rest })
    );
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Save the file to the Backend folder
    const filePath = path.join(__dirname, "../expenses.xlsx");
    fs.writeFileSync(filePath, buffer);

    res
      .status(200)
      .json({ message: "Excel file saved to backend folder", filePath });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error exporting expenses", error: err.message });
  }
};
