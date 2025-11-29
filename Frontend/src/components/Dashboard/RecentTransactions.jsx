import React, { memo } from "react";
import { LuWalletMinimal, LuHandCoins } from "react-icons/lu";
import { LuArrowRight } from "react-icons/lu";

const RecentTransactions = ({ transactions = [], onSeeMore }) => {
  // Sort transactions by date descending, handling various date formats
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = Date.parse(a.date) || 0;
    const dateB = Date.parse(b.date) || 0;
    return dateB - dateA;
  });
  return (
    <div className="card animate-bounceIn h-[400px] transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold text-gray-900">Recent Transactions</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>
      {sortedTransactions && sortedTransactions.length > 0 ? (
        <ul>
          {sortedTransactions.slice(0, 4).map((tx, idx) => {
            const isIncome = tx.type === "income";
            const name = isIncome ? tx.source : tx.category;
            const amount = (isIncome ? "+ " : "- ") + "₹" + tx.amount;
            const amountClass = isIncome ? "text-green-600" : "text-red-600";
            const icon = isIncome ? (
              <LuWalletMinimal className="text-2xl text-gray-400" />
            ) : (
              <LuHandCoins className="text-2xl text-gray-400" />
            );
            const date = new Date(tx.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            return (
              <li
                key={tx._id || idx}
                className="flex items-center justify-between bg-gray-50 rounded-lg mb-3 p-3 animate-fadeIn"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <div>
                    <div className="font-medium text-gray-800">{name}</div>
                    <div className="text-xs text-gray-400">{date}</div>
                  </div>
                </div>
                <div className={`font-semibold text-lg ${amountClass}`}>
                  {amount}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-gray-400 text-center py-4">
          No recent transactions
        </div>
      )}
    </div>
  );
};

export default memo(RecentTransactions);
