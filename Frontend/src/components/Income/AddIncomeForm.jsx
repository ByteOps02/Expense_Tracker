import React, { useState } from "react";
import { motion } from "framer-motion";
import { LuDollarSign, LuBriefcase } from "react-icons/lu";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";
import ModernDatePicker from "../Inputs/ModernDatePicker";

const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    title: "",
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
    icon: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setIncome((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!income.title.trim()) {
      newErrors.title = "Income title is required";
    }

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

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onAddIncome?.(income);

      setIncome({
        title: "",
        source: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        note: "",
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Source Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Income Title <span className="text-green-500">*</span>
            </label>
            <div className="relative group">
              <LuBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <input
                type="text"
                placeholder="e.g., Monthly Salary"
                value={income.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                  errors.title ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-200"
                }`}
              />
            </div>
            {errors.title && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 flex items-center gap-1"
              >
                {errors.title}
              </motion.p>
            )}
          </div>

          {/* Source with Emoji */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Source <span className="text-green-500">*</span>
            </label>
            <div className="flex gap-3">
              <div className="relative group flex-1">
                <LuBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g., Salary, Freelance"
                  value={income.source}
                  onChange={(e) => handleChange("source", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                    errors.source ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              <EmojiPickerPopup
                icon={income.icon}
                onSelect={(icon) => handleChange("icon", icon)}
              />
            </div>
            {errors.source && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 flex items-center gap-1"
              >
                {errors.source}
              </motion.p>
            )}
          </div>
        </div>

        {/* Amount & Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Amount <span className="text-green-500">*</span>
            </label>
            <div className="relative group">
              <LuDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <input
                type="number"
                placeholder="0.00"
                value={income.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                  errors.amount ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-200"
                }`}
                step="0.01"
                min="0"
              />
            </div>
            {errors.amount && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 flex items-center gap-1"
              >
                {errors.amount}
              </motion.p>
            )}
          </div>

          {/* Date */}
          <ModernDatePicker
            value={income.date}
            onChange={(e) => handleChange("date", e.target.value)}
            error={errors.date}
            colorTheme="green"
          />
        </div>

        {/* Note - Full Width */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Note
          </label>
          <textarea
            placeholder="Add notes about this income (optional)"
            value={income.note}
            onChange={(e) => handleChange("note", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding Income...
            </span>
          ) : (
            "Add Income"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddIncomeForm;