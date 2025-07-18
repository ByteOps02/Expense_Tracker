const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String },
    amount: { type: Number, required: true },
    source: { type: String, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", IncomeSchema);
