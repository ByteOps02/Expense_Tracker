import React from "react";
import { LuArrowRight } from "react-icons/lu";
import { LuWalletMinimal, LuHandCoins } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card animate-bounceIn h-[400px] transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Expenses</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        <ul>
          {transactions?.slice(0, 4)?.map((expense, idx) => {
            const isIncome = expense.type === "income";
            const icon = isIncome ? (
              <LuWalletMinimal className="text-2xl text-gray-400" />
            ) : (
              <LuHandCoins className="text-2xl text-gray-400" />
            );
            return (
              <li
                key={expense._id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-3 p-3 animate-fadeIn"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {expense.category}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {moment(expense.date).format("DD MMM, YYYY")}
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-lg text-red-600 dark:text-red-400">
                  - ₹{expense.amount}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseTransactions;
