import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    title: "",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0], // Default to today
    description: "",
    icon: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setExpense((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!expense.title.trim()) {
      newErrors.title = "Expense title is required";
    }

    if (!expense.amount || parseFloat(expense.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!expense.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onAddExpense?.(expense);

      // Reset form
      setExpense({
        title: "",
        category: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        icon: "",
      });

      setErrors({});
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
        Add New Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Title */}
          <Input
            label="Expense Title"
            placeholder="Rent, Groceries, etc."
            value={expense.title}
            onChange={(e) => handleChange("title", e.target.value)}
            type="text"
            error={errors.title}
          />

          {/* Category + Emoji */}
          <div className="flex items-end gap-2">
            <Input
              label="Category"
              placeholder="Food, Travel, Shopping"
              value={expense.category}
              onChange={(e) => handleChange("category", e.target.value)}
              type="text"
              className="flex-grow"
              error={errors.category}
            />

            <EmojiPickerPopup
              icon={expense.icon}
              onSelect={(icon) => handleChange("icon", icon)}
            />
          </div>

          {/* Amount */}
          <Input
            label="Amount"
            placeholder="Enter amount"
            value={expense.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            type="number"
            error={errors.amount}
          />

          {/* Date */}
          <Input
            label="Date"
            type="date"
            value={expense.date}
            onChange={(e) => handleChange("date", e.target.value)}
            error={errors.date}
          />
        </div>

        {/* Description - full width */}
        <div className="col-span-full">
          <Input
            label="Description"
            placeholder="Optional notes about this expense"
            value={expense.description}
            onChange={(e) => handleChange("description", e.target.value)}
            type="textarea"
            error={errors.description}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding Expense..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;
