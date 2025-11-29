import React, { useMemo } from "react";
import { LuPlus } from "react-icons/lu";
import {
  prepareExpenseLineChartData,
  prepareCategoryData,
} from "../../utils/helper";
import ChartJsLineChart from "../Charts/ChartJsLineChart";
import ChartJsDoughnutChart from "../Charts/ChartJsDoughnutChart";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const lineChartData = useMemo(() => prepareExpenseLineChartData(transactions), [transactions]);
  const categoryChartData = useMemo(() => prepareCategoryData(transactions, "category"), [transactions]);

  return (
    <div className="card w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h5 className="text-lg font-semibold text-gray-900">Expense Overview</h5>
          <p className="text-sm text-gray-500 mt-1">Track your spending trends and category distribution.</p>
        </div>

        {/* FIXED BUTTON */}
        <button className="add-btn flex-shrink-0" onClick={onAddExpense}>
          <LuPlus className="text-lg" />
          Add Expense
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <h6 className="text-sm font-semibold text-gray-700 mb-4">Spending Trend</h6>
          <div className="h-[300px]">
            <ChartJsLineChart data={lineChartData} />
          </div>
        </div>

        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col">
          <h6 className="text-sm font-semibold text-gray-700 mb-4">Category Breakdown</h6>
          <div className="h-[300px] flex items-center justify-center">
            {categoryChartData.length > 0 ? (
              <ChartJsDoughnutChart data={categoryChartData} />
            ) : (
              <div className="text-gray-400 text-sm">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseOverview;
