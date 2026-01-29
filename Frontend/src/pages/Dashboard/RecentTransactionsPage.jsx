// src/pages/Dashboard/RecentTransactionsPage.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import LoadingSpinner from "../../components/LoadingSpinner";
import TransactionInfoCard from "../../components/Cards/TransactionInfoCard";

import { LuDownload, LuFileText } from "react-icons/lu";
import TransactionsTable from "../../components/Transactions/TransactionsTable";
import { generatePDF } from "../../utils/pdfGenerator";

// RecentTransactionsPage component

const RecentTransactionsPage = () => {
  // State variables for transaction data and loading state
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false); // Changed initial state to false to handle initial fetch
  const [error, setError] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  /**
   * @desc    Handles the download of transaction data as an Excel file.
   */
  const handleDownloadExcel = async () => {
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
   * @desc    Fetches transaction records with pagination
   */
  const fetchTransactions = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.TRANSACTIONS.GET_ALL_TRANSACTIONS}?page=${pageNum}&limit=${LIMIT}`,
      );
      
      const newTransactions = response.data.data.transactions || [];
      const total = response.data.pagination?.total || 0;

      if (pageNum === 1) {
        setTransactions(newTransactions);
      } else {
        setTransactions((prev) => [...prev, ...newTransactions]);
      }

      // Check if we have loaded all transactions
      // Either if response is empty OR we reached the total count
      if (newTransactions.length < LIMIT || (pageNum * LIMIT) >= total) {
        setHasMore(false);
      } else {
        setHasMore(true);
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
    fetchTransactions(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage);
  };

  return (
    <DashboardLayout activeMenu="Recent Transactions">
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Transactions
          </h1>

          <div className="flex gap-2">
            <button className="card-btn" onClick={() => generatePDF("Transaction Report", transactions, [], "transaction")}>
                 <LuFileText className="text-base" /> PDF
            </button>
            <button className="card-btn" onClick={handleDownloadExcel}>
              <LuDownload className="text-base" /> Excel
            </button>
          </div>
        </div>
        
        {error && (
          <div className="card mb-6">
            <div className="text-center text-red-500 py-4">
              <p>{error}</p>
              <button
                onClick={() => fetchTransactions(page)}
                className="mt-2 btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="w-full">
            <div className="card">
              <TransactionsTable
                data={transactions}
                showActions={false}
              />
              
              {loading && (
                 <div className="flex items-center justify-center p-4">
                  <LoadingSpinner text="Loading..." />
                 </div>
              )}

              {!loading && hasMore && (
                <div className="flex justify-center p-4">
                  <button 
                    onClick={handleLoadMore}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}

              {!loading && !hasMore && transactions.length > 0 && (
                <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                  No more transactions to load.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecentTransactionsPage;
