// Import necessary packages
const mongoose = require("mongoose");

// Define the Expense schema
const ExpenseSchema = new mongoose.Schema(
  {
    // Reference to the User model
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Amount of the expense
    amount: { type: Number, required: true },
    // Category of the expense
    category: { type: String, required: true },
    // Date of the expense
    date: { type: Date, default: Date.now },
    // Optional note for the expense
    note: { type: String },
  },
  // Enable timestamps (createdAt and updatedAt)
  { timestamps: true },
);

// Add indexes to improve query performance
ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1 });
ExpenseSchema.index({ date: -1 });

// Export the Expense model
module.exports = mongoose.model("Expense", ExpenseSchema);