import React, { useState, useEffect, useCallback } from 'react'
import { useUserAuth } from "../../../hooks/useUserAuth"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import ExpenseOverview from '../../components/Expense/ExpenseOverview'
import SkeletonLoader from '../../components/SkeletonLoader';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { LuAlertTriangle } from 'react-icons/lu';

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenseDetails = useCallback(async () => {
    if (loading && expenseData.length > 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        setExpenseData(response.data);
      } else {
        setExpenseData([]);
      }
    }
    catch (err) {
      console.error("Expense fetch error:", err);
      setError("Failed to load expense data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, expenseData.length]);

  const handleRetry = () => {
    fetchExpenseDetails();
  };

  useEffect(() => {
    fetchExpenseDetails();
    return () => { };
  }, [fetchExpenseDetails]);

  if (error) {
    return (
      <DashboardLayout activeMenu="Expense">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuAlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Expense Data</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Expense">
      <ErrorBoundary>
        <div className='my-5 mx-auto'>
          <div className='grid grid-cols-1 gap-6'>
            <div className=''>
              {loading ? (
                <div className="space-y-6">
                  <SkeletonLoader type="card" />
                  <SkeletonLoader type="table" lines={5} />
                </div>
              ) : (
                <ExpenseOverview
                  transactions={expenseData}
                  onExpenseIncome={() => {}}
                />
              )}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default Expense