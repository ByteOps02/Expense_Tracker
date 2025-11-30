// Import necessary packages
const mongoose = require("mongoose");

// Define the Income schema
const IncomeSchema = new mongoose.Schema(
  {
    // Reference to the User model
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Title of the income
    title: { type: String, required: true },
    // Icon for the income source
    icon: { type: String },
    // Amount of the income
    amount: { type: Number, required: true },
    // Source of the income
    source: { type: String, required: true },
    // Date of the income
    date: { type: Date, default: Date.now },
    // Optional note for the income
    note: { type: String },
  },
  // Enable timestamps (createdAt and updatedAt)
  { timestamps: true },
);

// Add indexes to improve query performance
IncomeSchema.index({ user: 1, date: -1 });
IncomeSchema.index({ user: 1 });
IncomeSchema.index({ date: -1 });

// Export the Income model
module.exports = mongoose.model("Income", IncomeSchema);