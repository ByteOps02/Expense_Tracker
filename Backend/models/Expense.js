const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String },
  },
  { timestamps: true }
);

// Add indexes for better query performance
ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1 });
ExpenseSchema.index({ date: -1 });

module.exports = mongoose.model("Expense", ExpenseSchema);
