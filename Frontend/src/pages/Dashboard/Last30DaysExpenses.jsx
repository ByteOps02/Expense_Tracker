import React, { useMemo, memo } from "react";
import ChartJsDoughnutChart from "../../components/Charts/ChartJsDoughnutChart";
import { addThousandsSeparator, prepareTitleAndCategoryData } from "../../utils/helper";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4ADE80", "#3B82F6"];

const Last30DaysExpenses = ({ data }) => {
  const chartData = useMemo(() => prepareTitleAndCategoryData(data) || [], [data]);
  const totalExpense = useMemo(
    () => (data?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0),
    [data],
  );
  
  const topCategory = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
    const sorted = [...chartData].sort((a, b) => (b.amount || 0) - (a.amount || 0));
    return sorted[0];
  }, [chartData]);

  const getColorForCategory = (category) => {
    if (!category) return COLORS[0];
    const idx = chartData.findIndex((c) => c.name === category.name);
    return COLORS[(idx === -1 ? 0 : idx) % COLORS.length];
  };

  return (
    <div className="card h-[450px] transition-all duration-300 ease-in-out flex flex-col">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
          Last 30 Days Expenses
        </h5>
      </div>

      <div className="w-full h-[320px] mt-4 relative flex items-center justify-center">
        <ChartJsDoughnutChart data={chartData} colors={COLORS} />

        {chartData.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Expense</span>

            <span className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              ₹{addThousandsSeparator(totalExpense)}
            </span>
          </div>
        )}
      </div>

      {/* Top category label & colored dot moved below */}
      {topCategory && (
        <div className="mt-2 flex items-center justify-center space-x-2">
          <span
            aria-hidden
            className="shrink-0"
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              backgroundColor: getColorForCategory(topCategory),
              display: "inline-block",
            }}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {topCategory.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default memo(Last30DaysExpenses);
