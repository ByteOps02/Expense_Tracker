// Import necessary packages and components
import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";

// Form component for adding a new income
const AddIncomeForm = ({ onAddIncome }) => {
  // State for form fields, submission status, and errors
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
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
    setIncome({ ...income, [key]: value });
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
      if (onAddIncome) {
        await onAddIncome(income);
        // Reset the form after successful submission
        setIncome({
          source: "",
          amount: "",
          date: "",
          icon: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error adding income:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Add New Income</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={income.source}
            onChange={({ target }) => handleChange("source", target.value)}
            label="Income Source"
            placeholder="Freelance, Salary, etc"
            type="text"
            error={errors.source}
          />

          <div className="flex items-end gap-2">
            <Input
              value={income.amount}
              onChange={({ target }) => handleChange("amount", target.value)}
              label="Amount"
              placeholder="Enter amount"
              type="number"
              error={errors.amount}
              className="flex-grow"
            />
            <EmojiPickerPopup
              icon={income.icon}
              onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />
          </div>

          <Input
            value={income.date}
            onChange={({ target }) => handleChange("date", target.value)}
            label="Date"
            placeholder="Select date"
            type="date"
            error={errors.date}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isSubmitting ? "Adding Income..." : "Add Income"}
        </button>
      </form>
    </div>
  );
};

export default AddIncomeForm;