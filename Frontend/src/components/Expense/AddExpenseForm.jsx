// Import necessary packages and components
import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";

// Form component for adding a new expense
const AddExpenseForm = ({ onAddExpense }) => {
  // State for form fields, submission status, and errors
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
    description: "",
    icon: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * @desc    Handles changes in form fields
   * @param   {string} key - The name of the field to update
   * @param   {string} value - The new value of the field
   */
  const handleChange = (key, value) => {
    setExpense({ ...expense, [key]: value });
    // Clear the error for a field when the user starts typing
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  /**
   * @desc    Validates the form fields
   * @returns {boolean} - True if the form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};

    if (!expense.category.trim()) {
      newErrors.category = "Expense category is required";
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

  /**
   * @desc    Handles the form submission
   * @param   {object} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If the form is not valid, do not submit
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onAddExpense) {
        await onAddExpense(expense);
        // Reset the form after successful submission
        setExpense({
          category: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
          icon: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        {/* Emoji picker for selecting an icon */}
        <EmojiPickerPopup
          icon={expense.icon}
          onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
        />

        {/* Input fields for expense details */}
        <Input
          value={expense.category}
          onChange={({ target }) => handleChange("category", target.value)}
          label="Expense Category"
          placeholder="Food, Transport, Entertainment, etc"
          type="text"
          error={errors.category}
        />

        <Input
          value={expense.amount}
          onChange={({ target }) => handleChange("amount", target.value)}
          label="Amount"
          placeholder="Enter amount"
          type="number"
          error={errors.amount}
        />

        <Input
          value={expense.date}
          onChange={({ target }) => handleChange("date", target.value)}
          label="Date"
          placeholder="Select date"
          type="date"
          error={errors.date}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={expense.description}
            onChange={({ target }) => handleChange("description", target.value)}
            placeholder="Optional description"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
            rows="3"
          />
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Adding Expense..." : "Add Expense"}
      </button>
    </form>
  );
};

export default AddExpenseForm;