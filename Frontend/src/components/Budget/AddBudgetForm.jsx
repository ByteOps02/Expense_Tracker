import React from "react";
import { LuTag, LuWallet } from "react-icons/lu";
import ModernDatePicker from "../Inputs/ModernDatePicker";

const AddBudgetForm = ({
  formData,
  handleChange,
  handleInputChange,
  handleSubmit,
  editingBudget,
  closeModal,
}) => {
  return (
    <div
      className="
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-gray-100
        p-6 rounded-2xl shadow-lg
      "
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* CATEGORY */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Category <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <LuTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g., Food, Travel"
              className="
                w-full pl-10 pr-4 py-3 rounded-xl
                bg-gray-100 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                border border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2
                focus:ring-purple-300 dark:focus:ring-purple-800
              "
              required
            />
          </div>
        </div>

        {/* AMOUNT */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Amount <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <LuWallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              min="0"
              className="
                w-full pl-10 pr-4 py-3 rounded-xl
                bg-gray-100 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                border border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2
                focus:ring-purple-300 dark:focus:ring-purple-800
              "
              required
            />
          </div>
        </div>

        {/* START DATE */}
        <ModernDatePicker
          label="Start Date"
          value={formData.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
          name="startDate"
          colorTheme="purple"
        />

        {/* END DATE */}
        <ModernDatePicker
          label="End Date"
          value={formData.endDate}
          onChange={(e) => handleChange("endDate", e.target.value)}
          name="endDate"
          colorTheme="purple"
        />

        {/* IS RECURRING */}
        <div className="flex items-center">
          <input
            id="isRecurring"
            name="isRecurring"
            type="checkbox"
            checked={formData.isRecurring}
            onChange={handleInputChange}
            className="
              h-4 w-4
              text-purple-600
              focus:ring-purple-500
              border-gray-300 dark:border-gray-600
              rounded dark:bg-gray-700
            "
          />

          <label
            htmlFor="isRecurring"
            className="ml-2 text-sm text-gray-900 dark:text-gray-300"
          >
            Is Recurring?
          </label>
        </div>

        {/* Recurrence Type */}
        {formData.isRecurring && (
          <div className="space-y-2">
            <label
              htmlFor="recurrenceType"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Recurrence Type
            </label>

            <select
              id="recurrenceType"
              name="recurrenceType"
              value={formData.recurrenceType}
              onChange={handleInputChange}
              className="
                w-full px-4 py-3 rounded-xl
                bg-gray-100 dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                border border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2
                focus:ring-purple-300 dark:focus:ring-purple-800
              "
              required
            >
              <option value="">Select Type</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={closeModal}
            className="
              py-3.5 px-6 rounded-xl font-semibold
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
            className="
              py-3.5 px-6 rounded-xl font-semibold text-white
              bg-gradient-to-r from-purple-500 to-purple-600
              hover:from-purple-600 hover:to-purple-700
              shadow-lg shadow-purple-200 dark:shadow-purple-900/40
              transition-all
            "
          >
            {editingBudget ? "Update Budget" : "Add Budget"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBudgetForm;
