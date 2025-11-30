import React, { useMemo } from "react";
import ChartJsDoughnutChart from "../Charts/ChartJsDoughnutChart";
import { addThousandsSeparator, prepareCategoryData } from "../../utils/helper";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4ADE80", "#3B82F6"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const chartData = useMemo(
    () => prepareCategoryData(data, "source"),
    [data],
  );

  return (
    <div className="card animate-bounceIn h-[400px] transition-all duration-300 ease-in-out flex flex-col">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
          Last 60 Days Income
        </h5>
      </div>

      <div className="flex-1 w-full mt-4 min-h-0 relative flex items-center justify-center">
        <ChartJsDoughnutChart data={chartData} colors={COLORS} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Income</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            ₹{addThousandsSeparator(totalIncome)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecentIncomeWithChart;
