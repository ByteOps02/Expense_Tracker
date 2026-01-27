import React, { useMemo } from "react";
import { LuPlus } from "react-icons/lu";
import {
  prepareIncomeBarChartData,
  prepareTitleAndCategoryData,
} from "../../utils/helper";
import ChartJsBarChart from "../Charts/ChartJsBarChart";
import ChartJsDoughnutChart from "../Charts/ChartJsDoughnutChart";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const barChartData = useMemo(
    () => prepareIncomeBarChartData(transactions),
    [transactions]
  );

  const sourceChartData = useMemo(
    () => prepareTitleAndCategoryData(transactions),
    [transactions]
  );

  return (
    <div className="card w-full"> 
      <div className="flex items-center justify-between mb-6">
        <div>
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
            Income Overview
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your earnings and analyze income sources.
          </p>
        </div>

        <button className="add-btn flex-shrink-0" onClick={onAddIncome}>
          <LuPlus className="text-lg" />
          Add Income
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bar Chart Section */}
        <div id="income-bar-chart" className="lg:col-span-2 bg-gray-50/50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
          <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Income Trend
          </h6>
          <div className="h-[300px]">
            <ChartJsBarChart data={barChartData} />
          </div>
        </div>

        {/* Doughnut Chart Section */}
        <div id="income-doughnut-chart" className="bg-gray-50/50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col">
          <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Income Sources
          </h6>
          <div className="h-[300px] flex items-center justify-center overflow-y-auto custom-scrollbar">
            {sourceChartData.length > 0 ? (
              <ChartJsDoughnutChart data={sourceChartData} />
            ) : (
              <div className="text-gray-400 text-sm">No data available</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default IncomeOverview;
