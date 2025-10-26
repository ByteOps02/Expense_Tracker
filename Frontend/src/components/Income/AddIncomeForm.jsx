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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        {/* Emoji picker for selecting an icon */}
        <EmojiPickerPopup
          icon={income.icon}
          onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
        />

        {/* Input fields for income details */}
        <Input
          value={income.source}
          onChange={({ target }) => handleChange("source", target.value)}
          label="Income Source"
          placeholder="Freelance, Salary, etc"
          type="text"
          error={errors.source}
        />

        <Input
          value={income.amount}
          onChange={({ target }) => handleChange("amount", target.value)}
          label="Amount"
          placeholder="Enter amount"
          type="number"
          error={errors.amount}
        />

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
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Adding Income..." : "Add Income"}
      </button>
    </form>
  );
};

export default AddIncomeForm;