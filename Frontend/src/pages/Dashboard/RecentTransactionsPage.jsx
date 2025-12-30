// src/pages/Dashboard/RecentTransactionsPage.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useUserAuth } from "../../hooks/useUserAuth";
import TransactionInfoCard from "../../components/Cards/TransactionInfoCard";

// RecentTransactionsPage component
const RecentTransactionsPage = () => {
  // Ensure user is authenticated before loading data
  useUserAuth();

  // State variables for transaction data and loading state
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * @desc    Fetches all transaction records for the user
   */
  const fetchAllTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.TRANSACTIONS.GET_ALL_TRANSACTIONS}`
      );

      if (response.data && response.data.data.transactions) {
        setTransactions(response.data.data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transaction data. Please try again.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transaction data on component mount
  useEffect(() => {
    fetchAllTransactions();
  }, []);

  return (
    <DashboardLayout activeMenu="Recent Transactions">
      <div className="w-full max-w-[1400px] mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Transactions</h1>
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Loading transaction data..." />
          </div>
        ) : error ? (
          <div className="card">
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
              <button onClick={fetchAllTransactions} className="mt-4 btn-primary">
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-full">
              <div className="card">
                <div className="flex flex-col space-y-4">
                  {transactions.map((transaction) => {
                    const isIncome = transaction.source;
                    const title = isIncome ? transaction.source : transaction.category;
                    const type = isIncome ? "income" : "expense";

                    return (
                      <TransactionInfoCard
                        key={transaction._id}
                        {...transaction}
                        title={title}
                        type={type}
                        hideDeleteBtn={true}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecentTransactionsPage;
