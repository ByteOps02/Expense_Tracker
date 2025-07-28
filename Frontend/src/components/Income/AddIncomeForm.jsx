import React, { useState } from 'react'
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../layouts/EmojiPickerPopup';

const AddIncomeForm = ({onAddIncome}) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setIncome({ ...income, [key]: value });
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onAddIncome) {
        await onAddIncome(income);
        setIncome({
          source: "",
          amount: "",
          date: "",
          icon: ""
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
        <EmojiPickerPopup
          icon={income.icon}
          onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
        />

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
