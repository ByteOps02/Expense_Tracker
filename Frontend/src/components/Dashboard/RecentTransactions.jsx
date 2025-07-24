import React from 'react';

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
          {transactions.map((tx, idx) => (
            <li key={tx._id || idx} className="py-2 border-b last:border-b-0 flex justify-between items-center">
              <span className="capitalize">{tx.type === 'income' ? 'Income' : 'Expense'}</span>
              <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                {tx.amount}
              </span>
              <span className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-400 text-center py-4">No recent transactions</div>
      )}
    </div>
  );
};

export default RecentTransactions; 