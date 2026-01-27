import React, { memo } from "react";
import ChartJsDoughnutChart from "../Charts/ChartJsDoughnutChart";
import { addThousandsSeparator } from "../../utils/helper";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4ADE80", "#3B82F6"];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Expenses", amount: totalExpense },
    { name: "Total Income", amount: totalIncome },
  ];

  return (
    <div className="card h-[450px] transition-all duration-300 ease-in-out flex flex-col">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
          Financial Overview
        </h5>
      </div>
      <div className="w-full h-[320px] mt-4 relative flex items-center justify-center">
        <ChartJsDoughnutChart data={balanceData} colors={COLORS} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Total Balance
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            ₹{addThousandsSeparator(totalBalance)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(FinanceOverview);
