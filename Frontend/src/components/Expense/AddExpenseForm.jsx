// Import necessary packages and components
import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";

// Form component for adding a new expense
const AddExpenseForm = ({ onAddExpense }) => {
  // State for form fields, submission status, and errors
  const [expense, setExpense] = useState({
    title: "",
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
          title: "",
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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={expense.title}
            onChange={({ target }) => handleChange("title", target.value)}
            label="Expense Title"
            placeholder="Rent, Groceries, etc."
            type="text"
            error={errors.title}
          />

          <div className="flex items-end gap-2">
            <Input
              value={expense.category}
              onChange={({ target }) => handleChange("category", target.value)}
              label="Category"
              placeholder="Utilities, Food, Entertainment"
              type="text"
              error={errors.category}
              className="flex-grow"
            />
            <EmojiPickerPopup
              icon={expense.icon}
              onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />
          </div>

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
        </div>
        <div className="col-span-full">
            <Input
              value={expense.description}
              onChange={({ target }) => handleChange("description", target.value)}
              label="Description"
              placeholder="Optional notes about this expense"
              type="textarea"
              error={errors.description}
            />
          </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isSubmitting ? "Adding Expense..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;