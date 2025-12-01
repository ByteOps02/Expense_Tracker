// Import necessary packages and components
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import IncomeList from "../../components/Income/IncomeList";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import Modal from "../../components/layouts/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useUserAuth } from "../../../hooks/useUserAuth";

// Income page component
const Income = () => {
  // Ensure user is authenticated before loading data
  useUserAuth();

  // State variables for income data, loading state, and modal visibility
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [error, setError] = useState(null);

  /**
   * @desc    Handles adding a new income record
   * @param   {object} incomeData - The new income data from the form
   */
  const handleAddIncome = async (incomeData) => {
    try {
      const response = await axiosInstance.post(
        `${API_PATHS.INCOME.ADD_INCOME}`,
        incomeData,
      );

      if (response.data) {
        console.log("Income added successfully:", response.data);
        setIncomeData((prevIncomes) => [...prevIncomes, response.data.income]);
        setOpenAddIncomeModal(false);
      }
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Failed to add income. Please try again.");
    }
  };

  /**
   * @desc    Handles deleting an income record
   * @param   {string} incomeId - The ID of the income record to delete
   */
  const handleDeleteIncome = async (incomeId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_PATHS.INCOME.DELETE_INCOME(incomeId)}`,
      );

      if (response.data) {
        console.log("Income deleted successfully:", response.data);
        setIncomeData((prevIncomes) =>
          prevIncomes.filter((income) => income._id !== incomeId),
        );
      }
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income. Please try again.");
    }
  };

  /**
   * @desc    Handles downloading income data as an Excel file
   */
  const handleDownloadIncome = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.DOWNLOAD_INCOME}`,
        { responseType: "blob" },
      );

      // Create a temporary URL and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading income:", error);
      alert("Failed to download income data. Please try again.");
    }
  };

  /**
   * @desc    Fetches all income records for the user
   */
  const fetchIncomeDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`,
      );

      console.log("Income API Response:", response.data);

      if (response.data && response.data.incomes) {
        setIncomeData(response.data.incomes);
      } else {
        console.log("No income data found in response");
        setIncomeData([]);
      }
    } catch (error) {
      console.error("Error fetching income:", error);
      setError("Failed to load income data. Please try again.");
      setIncomeData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch income data on component mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchIncomeDetails();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="w-full max-w-[1400px] mx-auto px-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Loading income data..." />
          </div>
        ) : error ? (
          <div className="card">
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
              <button
                onClick={fetchIncomeDetails}
                className="mt-4 btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Income overview and add income button */}
            <div className="w-full">
              <IncomeOverview
                transactions={incomeData}
                onAddIncome={() => setOpenAddIncomeModal(true)}
              />
            </div>

            {/* List of income records */}
            <div className="w-full">
              <IncomeList
                transactions={incomeData}
                onDelete={handleDeleteIncome}
                onDownload={handleDownloadIncome}
              />
            </div>
          </div>
        )}

        {/* Modal for adding a new income record */}
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;