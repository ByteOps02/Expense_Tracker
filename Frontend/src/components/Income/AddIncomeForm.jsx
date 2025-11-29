// Import necessary packages and components
import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";

// Form component for adding a new income
const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (key, value) => {
    setIncome((prev) => ({ ...prev, [key]: value }));

    // Clear error for that field
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!income.source.trim()) {
      newErrors.source = "Income source is required";
    }

    if (!income.amount || parseFloat(income.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!income.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onAddIncome?.(income);

      // Reset form
      setIncome({
        source: "",
        amount: "",
        date: "",
        icon: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error adding income:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
        Add New Income
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Income Source */}
          <Input
            label="Income Source"
            placeholder="Freelance, Salary, etc"
            value={income.source}
            onChange={(e) => handleChange("source", e.target.value)}
            type="text"
            error={errors.source}
          />

          {/* Amount + Emoji Picker */}
          <div className="flex items-end gap-2">
            <Input
              label="Amount"
              placeholder="Enter amount"
              value={income.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              type="number"
              error={errors.amount}
              className="flex-grow"
            />
            <EmojiPickerPopup
              icon={income.icon}
              onSelect={(icon) => handleChange("icon", icon)}
            />
          </div>

          {/* Date */}
          <Input
            label="Date"
            placeholder="Select date"
            type="date"
            value={income.date}
            onChange={(e) => handleChange("date", e.target.value)}
            error={errors.date}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isSubmitting ? "Adding Income..." : "Add Income"}
        </button>
      </form>
    </div>
  );
};

export default AddIncomeForm;
