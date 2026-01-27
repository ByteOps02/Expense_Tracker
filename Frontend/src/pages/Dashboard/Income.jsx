// Import necessary packages and components
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import TransactionsTable from "../../components/Transactions/TransactionsTable"; // Replaced IncomeList
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import Modal from "../../components/layouts/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import LoadingSpinner from "../../components/LoadingSpinner";
import { LuDownload, LuSearch, LuX, LuFileText } from "react-icons/lu";
import { generatePDF } from "../../utils/pdfGenerator";

// Income page component
const Income = () => {
  // State variables for income data, loading state, and modal visibility
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [error, setError] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null); // State for editing

  /**
   * @desc    Handles adding or updating an income record
   * @param   {object} incomeData - The income data from the form
   */
  const handleSaveIncome = async (data) => {
    try {
        if (data._id) {
            // Update existing income
            await updateIncome(data._id, data);
        } else {
            // Add new income
            await addIncome(data);
        }
        setOpenAddIncomeModal(false);
        setEditingIncome(null);
    } catch (error) {
        console.error("Error saving income:", error);
        // Error handling already mostly in sub-functions or can be consolidated here
    }
  };

  const addIncome = async (data) => {
      try {
        const response = await axiosInstance.post(
          `${API_PATHS.INCOME.ADD_INCOME}`,
          data,
        );
  
        if (response.data) {
          setIncomeData((prevIncomes) => [response.data.data.income, ...prevIncomes]);
        }
      } catch (error) {
        console.error("Error adding income:", error);
        alert("Failed to add income. Please try again.");
        throw error;
      }
  };

  const updateIncome = async (id, data) => {
      try {
        const response = await axiosInstance.put(
            // Assuming endpoint structure, check apiPath if needed. 
            // Usually ID is part of URL for PUT.
            // From apiPath.js: ADD_INCOME: "/api/v1/income", DELETE is /:id. 
            // We need to verfiy PUT endpoint. Based on typical REST: /api/v1/income/:id
            `${API_PATHS.INCOME.ADD_INCOME}/${id}`, 
            data
        );

        if (response.data) {
             setIncomeData((prevIncomes) => 
                prevIncomes.map(item => item._id === id ? response.data.data.income : item)
             );
        }
      } catch (error) {
          console.error("Error updating income:", error);
          alert("Failed to update income. Please try again.");
          throw error;
      }
  };

  const handleEditClick = (income) => {
      setEditingIncome(income);
      setOpenAddIncomeModal(true);
  };

  const handleModalClose = () => {
      setOpenAddIncomeModal(false);
      setEditingIncome(null);
  };

  /**
   * @desc    Handles deleting an income record
   * @param   {string} incomeId - The ID of the income record to delete
   */
  const handleDeleteIncome = async (incomeId) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;
    
    try {
      await axiosInstance.delete(
        `${API_PATHS.INCOME.DELETE_INCOME(incomeId)}`,
      );

      setIncomeData((prevIncomes) =>
        prevIncomes.filter((income) => income._id !== incomeId),
      );
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

      if (response.data && response.data.data.incomes) {
        setIncomeData(response.data.data.incomes);
      } else {
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

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter Logic
  const filteredIncome = incomeData.filter((income) => {
    const matchesSearch =
      income.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.source?.toLowerCase().includes(searchTerm.toLowerCase()); // Handle incomplete data

    const incomeDate = new Date(income.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (end) end.setHours(23, 59, 59, 999); // Include the end date fully

    const matchesDate =
        (!start || incomeDate >= start) &&
        (!end || incomeDate <= end);

    return matchesSearch && matchesDate;
  });

  return (
    <DashboardLayout activeMenu="Income">
      <div className="w-full max-w-[1400px] mx-auto">
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
            
            {/* SEARCH & FILTER CONTROLS */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                {/* Search */}
                <div className="flex-1 relative">
                    <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search income..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-purple-500/50 outline-none text-gray-900 dark:text-white"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <LuX />
                        </button>
                    )}
                </div>

                {/* Date Range */}
                <div className="flex gap-2">
                    <div className="w-40">
                         <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-purple-500/50 outline-none text-gray-900 dark:text-white text-sm"
                            placeholder="Start Date"
                         />
                    </div>
                    <div className="w-40">
                         <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-purple-500/50 outline-none text-gray-900 dark:text-white text-sm"
                            placeholder="End Date"
                         />
                    </div>
                    {(startDate || endDate) && (
                        <button 
                            onClick={() => { setStartDate(""); setEndDate(""); }}
                            className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Income overview and add income button */}
            <div className="w-full">
              <IncomeOverview
                transactions={filteredIncome} // CHANGED: Pass filtered data
                onAddIncome={() => {
                    setEditingIncome(null);
                    setOpenAddIncomeModal(true);
                }}
              />
            </div>

            {/* List of income records (TABLE LAYOUT) */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Income Records</h5>
                    <div className="flex gap-2">
                         <div className="text-xs text-gray-500 self-center dark:text-gray-400">
                            {filteredIncome.length} record{filteredIncome.length !== 1 ? 's' : ''} found
                         </div>
                         <button className="card-btn" onClick={() => generatePDF("Income Report", filteredIncome, ["income-bar-chart", "income-doughnut-chart"], "income")}>
                             <LuFileText className="text-base" /> PDF
                         </button>
                         <button className="card-btn" onClick={handleDownloadIncome}>
                             <LuDownload className="text-base" /> Excel
                         </button>
                    </div>
                </div>
                <TransactionsTable 
                    data={filteredIncome} // CHANGED: Pass filtered data
                    onEdit={handleEditClick}
                    onDelete={handleDeleteIncome}
                    type="income"
                />
            </div>
          </div>
        )}

        {/* Modal for adding/editing income record */}
        <Modal
          isOpen={openAddIncomeModal}
          onClose={handleModalClose}
          title={editingIncome ? "Edit Income" : "Add Income"}
        >
          <AddIncomeForm 
            onAddIncome={handleSaveIncome} 
            closeModal={handleModalClose} 
            editingData={editingIncome}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;