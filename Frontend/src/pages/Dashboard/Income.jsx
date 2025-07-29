import React, { useEffect, useState, useCallback } from 'react'
import DashboardLayout from "../../components/layouts/DashboardLayout"
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import Modal from '../../components/layouts/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/layouts/DeleteAlert';
import SkeletonLoader from '../../components/SkeletonLoader';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import { LuAlertTriangle, LuRefreshCw } from 'react-icons/lu';

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddIncome = async (incomeData) => {
    setIsAdding(true);
    try {
      const response = await axiosInstance.post(
        `${API_PATHS.INCOME.ADD_INCOME}`,
        incomeData
      );
      
      if (response.data) {
        console.log("Income added successfully:", response.data);
        setOpenAddIncomeModal(false);
        // Refresh the income data
        fetchIncomeDetails();
      }
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Failed to add income. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };
  
  const fetchIncomeDetails = useCallback(async () => {
    if (loading && incomeData.length > 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      console.log("Income API Response:", response.data);
      
      if (response.data && response.data.incomes) {
        setIncomeData(response.data.incomes);
      } else {
        console.log("No income data found in response");
        setIncomeData([]);
      }
    } catch (err) {
      console.error("Income fetch error:", err);
      setError("Failed to load income data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, incomeData.length]);

  const handleDeleteIncome = (id) => {
    setIncomeToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteIncome = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(incomeToDelete));
      setIncomeData(prev => prev.filter(income => income._id !== incomeToDelete));
      setDeleteModalOpen(false);
      setIncomeToDelete(null);
    } catch (err) {
      console.error("Delete income error:", err);
      alert("Failed to delete income. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadIncome = () => {
    alert('Download income data');
  };

  const handleRetry = () => {
    fetchIncomeDetails();
  };

  useEffect(() => {
    fetchIncomeDetails();
    return () => { };
  }, [fetchIncomeDetails]);

  if (error) {
    return (
      <DashboardLayout activeMenu="Income">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuAlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Income Data</h3>
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
    <DashboardLayout activeMenu="Income">
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
                <>
                  <IncomeOverview
                    transactions={incomeData}
                    onAddIncome={() => setOpenAddIncomeModal(true)}
                  />
                  <div className="mt-8">
                    <IncomeList
                      transactions={incomeData}
                      onDelete={handleDeleteIncome}
                      onDownload={handleDownloadIncome}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          
          <Modal
            isOpen={openAddIncomeModal}
            onClose={() => setOpenAddIncomeModal(false)}
            title="Add Income"
          >
            {isAdding ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner text="Adding income..." />
              </div>
            ) : (
              <AddIncomeForm onAddIncome={handleAddIncome} />
            )}
          </Modal>
          
          <Modal 
            isOpen={deleteModalOpen} 
            onClose={() => setDeleteModalOpen(false)} 
            title="Delete Income"
          >
            <DeleteAlert
              content="Are you sure you want to delete this income detail?"
              onDelete={confirmDeleteIncome}
              isDeleting={isDeleting}
            />
          </Modal>
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  )
}

export default Income