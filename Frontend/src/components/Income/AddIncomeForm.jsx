import React, { useState } from "react";
import { motion } from "framer-motion";
import { LuIndianRupee, LuBriefcase } from "react-icons/lu";
import EmojiPickerPopup from "../layouts/EmojiPickerPopup";
import ModernDatePicker from "../Inputs/ModernDatePicker";

const AddIncomeForm = ({ onAddIncome, closeModal }) => {
  const [income, setIncome] = useState({
    title: "",
    source: "",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
    icon: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setIncome((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!income.title.trim()) newErrors.title = "Income title is required";
    if (!income.source.trim()) newErrors.source = "Income source is required";
    if (!income.category.trim()) newErrors.category = "Category is required";
    if (!income.amount || parseFloat(income.amount) <= 0)
      newErrors.amount = "Please enter a valid amount";
    if (!income.date) newErrors.date = "Date is required";

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
        category: "",
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

  const handleCancel = () => {
    if (closeModal) closeModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className="
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-gray-100
          border border-gray-200 dark:border-gray-700
          p-6 rounded-2xl shadow-lg
        "
      >
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE + SOURCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Income Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Income Title <span className="text-green-500">*</span>
              </label>

              <div className="relative">
                <LuBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />

                <input
                  type="text"
                  placeholder="e.g., Monthly Salary"
                  value={income.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-xl
                    bg-gray-100 dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    border
                    ${
                      errors.title
                        ? "border-red-400"
                        : "border-gray-300 dark:border-gray-700"
                    }
                    focus:outline-none focus:ring-2
                    focus:ring-green-300 dark:focus:ring-green-800
                  `}
                />
              </div>

              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Source + Emoji */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Source <span className="text-green-500">*</span>
              </label>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <LuBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />

                  <input
                    type="text"
                    placeholder="e.g., Company, Freelance"
                    value={income.source}
                    onChange={(e) => handleChange("source", e.target.value)}
                    className={`
                      w-full pl-10 pr-4 py-2.5 rounded-xl
                      bg-gray-100 dark:bg-gray-800
                      text-gray-900 dark:text-gray-100
                      border
                      ${
                        errors.source
                          ? "border-red-400"
                          : "border-gray-300 dark:border-gray-700"
                      }
                      focus:outline-none focus:ring-2
                      focus:ring-green-300 dark:focus:ring-green-800
                    `}
                  />
                </div>

                <EmojiPickerPopup
                  icon={income.icon}
                  onSelect={(icon) => handleChange("icon", icon)}
                />
              </div>

              {errors.source && (
                <p className="text-xs text-red-500">{errors.source}</p>
              )}
            </div>
          </div>
            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Category <span className="text-green-500">*</span>
              </label>

              <div className="relative">
                <LuBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />

                <input
                  type="text"
                  placeholder="e.g., Salary, Investment"
                  value={income.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-xl
                    bg-gray-100 dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    border
                    ${
                      errors.category
                        ? "border-red-400"
                        : "border-gray-300 dark:border-gray-700"
                    }
                    focus:outline-none focus:ring-2
                    focus:ring-green-300 dark:focus:ring-green-800
                  `}
                />
              </div>

              {errors.category && (
                <p className="text-xs text-red-500">{errors.category}</p>
              )}
            </div>

          {/* AMOUNT + DATE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Amount <span className="text-green-500">*</span>
              </label>

              <div className="relative">
                <LuIndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />

                <input
                  type="number"
                  placeholder="0.00"
                  value={income.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-xl
                    bg-gray-100 dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    border
                    ${
                      errors.amount
                        ? "border-red-400"
                        : "border-gray-300 dark:border-gray-700"
                    }
                    focus:outline-none focus:ring-2
                    focus:ring-green-300 dark:focus:ring-green-800
                  `}
                  step="0.01"
                  min="0"
                />
              </div>

              {errors.amount && (
                <p className="text-xs text-red-500">{errors.amount}</p>
              )}
            </div>

            {/* Date Picker */}
            <ModernDatePicker
              label="Date"
              value={income.date}
              onChange={(e) => handleChange("date", e.target.value)}
              error={errors.date}
              colorTheme="green"
              inputClassName="py-2.5 h-11"
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Note</label>

            <textarea
              rows={3}
              placeholder="Add notes about this income (optional)"
              value={income.note}
              onChange={(e) => handleChange("note", e.target.value)}
              className="
                w-full px-4 py-3 rounded-xl
                bg-gray-100 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                border border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2
                focus:ring-green-300 dark:focus:ring-green-800
                resize-none
              "
            />
          </div>

          {/* BUTTONS - same as AddExpenseForm */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="
                py-3 px-6 rounded-xl font-semibold
                bg-gray-100 dark:bg-gray-700
                text-gray-700 dark:text-gray-300
                shadow-lg shadow-gray-200 dark:shadow-gray-900/30
                transition-all
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                py-3 px-6 rounded-xl font-semibold text-white
                bg-gradient-to-r from-green-500 to-green-600
                hover:from-green-600 hover:to-green-700
                shadow-lg shadow-green-200 dark:shadow-green-900/40
                transition-all
                disabled:opacity-50
              "
            >
              {isSubmitting ? "Adding Income..." : "Add Income"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddIncomeForm;
