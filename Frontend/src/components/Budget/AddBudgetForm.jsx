import React from 'react';
import { LuTag, LuWallet } from 'react-icons/lu'; // Import icons
import ModernDatePicker from '../Inputs/ModernDatePicker'; // Import ModernDatePicker

const AddBudgetForm = ({ formData, handleChange, handleInputChange, handleSubmit, editingBudget, closeModal }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Category <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
              <LuTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
              <input
                  type="text"
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  required
              />
          </div>
      </div>

      {/* Amount */}
      <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
              <LuWallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
              <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  required
                  min="0"
              />
          </div>
      </div>

      {/* Start Date */}
      <ModernDatePicker
          label="Start Date"
          value={formData.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
          name="startDate"
          colorTheme="purple"
      />
      {/* End Date */}
      <ModernDatePicker
          label="End Date"
          value={formData.endDate}
          onChange={(e) => handleChange("endDate", e.target.value)}
          name="endDate"
          colorTheme="purple"
      />

      <div className="flex items-center">
        <input
          id="isRecurring"
          name="isRecurring"
          type="checkbox"
          checked={formData.isRecurring}
          onChange={handleInputChange}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Is Recurring?</label>
      </div>
      {formData.isRecurring && (
        <div className="space-y-2">
          <label htmlFor="recurrenceType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Recurrence Type</label>
          <select
            name="recurrenceType"
            id="recurrenceType"
            value={formData.recurrenceType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            required={formData.isRecurring}
          >
            <option value="">Select Type</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={closeModal}
          className="w-auto py-3.5 px-6 font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl transition-all duration-200 shadow-lg shadow-gray-200 dark:shadow-gray-900/30"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-auto py-3.5 px-6 font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl transition-all duration-200 shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {editingBudget ? 'Update Budget' : 'Add Budget'}
        </button>
      </div>
    </form>
  );
};

export default AddBudgetForm;
