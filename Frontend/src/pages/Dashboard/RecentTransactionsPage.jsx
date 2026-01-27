// src/pages/Dashboard/RecentTransactionsPage.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import LoadingSpinner from "../../components/LoadingSpinner";
import TransactionInfoCard from "../../components/Cards/TransactionInfoCard";

import { LuDownload } from "react-icons/lu";
import TransactionsTable from "../../components/Transactions/TransactionsTable";

// RecentTransactionsPage component

const RecentTransactionsPage = () => {
  // State variables for transaction data and loading state
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * @desc    Handles the download of transaction data as an Excel file.
   */
  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.TRANSACTIONS.DOWNLOAD_EXCEL,
        {
          responseType: "blob", // Important for downloading files
        },
      );
      // Create a blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.xlsx"); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("Error downloading transactions:", error);
      setError("Failed to download transaction data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**

   * @desc    Fetches all transaction records for the user

   */

  const fetchAllTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.TRANSACTIONS.GET_ALL_TRANSACTIONS}`,
      );
      if (response.data && response.data.data.transactions) {
        setTransactions(response.data.data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transaction data. Please try again.");
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
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Transactions
          </h1>

          <button className="card-btn" onClick={handleDownload}>
            <LuDownload className="text-base" /> Download
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Loading transaction data..." />
          </div>
        ) : error ? (
          <div className="card">
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
              <button
                onClick={fetchAllTransactions}
                className="mt-4 btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-full">
              <div className="card">
                <TransactionsTable
                  data={transactions}
                  showActions={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecentTransactionsPage;
