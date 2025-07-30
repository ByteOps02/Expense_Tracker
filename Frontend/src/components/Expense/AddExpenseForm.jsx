import React, { useState } from 'react';
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../layouts/EmojiPickerPopup';

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    icon: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setExpense({ ...expense, [key]: value });
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onAddExpense) {
        await onAddExpense(expense);
        setExpense({
          category: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          icon: ''
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
        <EmojiPickerPopup
          icon={expense.icon}
          onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
        />

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows="3"
          />
        </div>
      </div>
      
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