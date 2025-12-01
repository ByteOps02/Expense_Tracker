import React from "react";
import { LuPlus } from "react-icons/lu";

const BudgetOverview = ({ onAddBudget, reportStartDate, setReportStartDate, reportEndDate, setReportEndDate }) => {
  return (
    <div className="card w-full">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Overview</h5>
          <p className="text-sm text-gray-500 mt-1">Monitor your financial goals and spending limits.</p>
        </div>

        <div className="flex items-center space-x-4">
            <div>
                <label htmlFor="reportStartDate" className="sr-only">Start Date</label>
                <input
                    type="date"
                    id="reportStartDate"
                    value={reportStartDate}
                    onChange={(e) => setReportStartDate(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200"
                />
            </div>
            <div>
                <label htmlFor="reportEndDate" className="sr-only">End Date</label>
                <input
                    type="date"
                    id="reportEndDate"
                    value={reportEndDate}
                    onChange={(e) => setReportEndDate(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200"
                />
            </div>
            <button className="add-btn flex-shrink-0" onClick={onAddBudget}>
                <LuPlus className="text-lg" />
                Add New Budget
            </button>
        </div>
      </div>

      {/* Placeholder for budget-specific charts or summaries */}
      <div className="mt-4 p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
        <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Budget Summary</h6>
        <p className="text-gray-600 dark:text-gray-400">Detailed budget visualizations will appear here once data is available.</p>
      </div>
    </div>
  );
};

export default BudgetOverview;
