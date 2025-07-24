import React from 'react';
import { LuWalletMinimal, LuHandCoins } from 'react-icons/lu';

const RecentTransactions = ({ transactions = [], onSeeMore }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <button
          className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1"
          onClick={onSeeMore}
        >
          See All <span>&rarr;</span>
        </button>
      </div>
      {transactions && transactions.length > 0 ? (
        <ul>
          {transactions.map((tx, idx) => {
            const isIncome = tx.type === 'income';
            const name = isIncome ? tx.source : tx.category;
            const amount = (isIncome ? '+ ' : '- ') + '₹' + tx.amount;
            const amountClass = isIncome ? 'text-green-600' : 'text-red-600';
            const icon = isIncome ? <LuWalletMinimal className="text-2xl text-gray-400" /> : <LuHandCoins className="text-2xl text-gray-400" />;
            const date = new Date(tx.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            return (
              <li key={tx._id || idx} className="flex items-center justify-between bg-gray-50 rounded-lg mb-3 p-3">
                <div className="flex items-center gap-3">
                  {icon}
                  <div>
                    <div className="font-medium text-gray-800">{name}</div>
                    <div className="text-xs text-gray-400">{date}</div>
                  </div>
                </div>
                <div className={`font-semibold text-lg ${amountClass}`}>{amount}</div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-gray-400 text-center py-4">No recent transactions</div>
      )}
    </div>
  );
};

export default RecentTransactions; 