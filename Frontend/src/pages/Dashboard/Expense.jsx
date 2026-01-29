import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import TransactionsTable from "../../components/Transactions/TransactionsTable"; // Replaced ExpenseList
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import Modal from "../../components/layouts/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import LoadingSpinner from "../../components/LoadingSpinner";
import { LuDownload, LuSearch, LuX, LuFileText } from "react-icons/lu";
import { generatePDF } from "../../utils/pdfGenerator";

// Expense page component
const Expense = () => {
  // State variables for expense data, loading state, and modal visibility
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [error, setError] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null); // State for editing

  /**
   * @desc    Handles adding or updating an expense record
   * @param   {object} expenseData - The expense data from the form
   */
  const handleSaveExpense = async (data) => {
    try {
        if (data._id) {
            // Update
            await updateExpense(data._id, data);
        } else {
            // Add
            await addExpense(data);
        }
        setOpenAddExpenseModal(false);
        setEditingExpense(null);
    } catch (error) {
        console.error("Error saving expense:", error.response || error);
        // Error handling mostly in sub-functions or can be done here
    }
  };

  const addExpense = async (data) => {
    try {
      const response = await axiosInstance.post(
        `${API_PATHS.EXPENSE.ADD_EXPENSE}`,
        data
      );

      if (response.data) {
        setExpenseData((prevExpenses) => [
          response.data.data.expense,
          ...prevExpenses,
        ]);
      }
    } catch (error) {
      console.error("Error adding expense:", error.response || error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to add expense. Please try again.";
      alert(errorMessage);
      throw error;
    }
  };

  const updateExpense = async (id, data) => {
      try {
        const response = await axiosInstance.put(
            `${API_PATHS.EXPENSE.ADD_EXPENSE}/${id}`, 
            data
        );

        if (response.data) {
             setExpenseData((prevExpenses) => 
                prevExpenses.map(item => item._id === id ? response.data.data.expense : item)
             );
        }
      } catch (error) {
          console.error("Error updating expense:", error);
          alert("Failed to update expense. Please try again.");
          throw error;
      }
  };

  const handleEditClick = (expense) => {
      setEditingExpense(expense);
      setOpenAddExpenseModal(true);
  };

  const handleModalClose = () => {
      setOpenAddExpenseModal(false);
      setEditingExpense(null);
  };

  /**
   * @desc    Handles deleting an expense record
   * @param   {string} expenseId - The ID of the expense record to delete
   */
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      await axiosInstance.delete(
        `${API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId)}`
      );

      setExpenseData((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== expenseId)
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  };

  /**
   * @desc    Handles downloading expense data as an Excel file
   */
  const handleDownloadExpense = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.DOWNLOAD_EXPENSE}`,
        { responseType: "blob" }
      );

      // Create a temporary URL and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading expense:", error);
      alert("Failed to download expense data. Please try again.");
    }
  };

  /**
   * @desc    Fetches all expense records for the user
   */
  const fetchExpenseDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data && response.data.data.expenses) {
        setExpenseData(response.data.data.expenses);
      } else {
        setExpenseData([]);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to load expense data. Please try again.");
      setExpenseData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch expense data on component mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchExpenseDetails();
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
  const filteredExpenses = expenseData.filter((expense) => {
    const matchesSearch =
      (expense.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (expense.category?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const expenseDate = new Date(expense.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (end) end.setHours(23, 59, 59, 999); // Include the end date fully

    const matchesDate =
        (!start || expenseDate >= start) &&
        (!end || expenseDate <= end);

    return matchesSearch && matchesDate;
  });

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="w-full max-w-[1400px] mx-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Loading expense data..." />
          </div>
        ) : error ? (
          <div className="card">
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
              <button onClick={fetchExpenseDetails} className="mt-4 btn-primary">
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
                        placeholder="Search expenses..." 
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

            {/* Expense overview and add expense button */}
            <div className="w-full">
              <ExpenseOverview
                transactions={filteredExpenses} // CHANGED
                onAddExpense={() => {
                    setEditingExpense(null);
                    setOpenAddExpenseModal(true);
                }}
              />
            </div>

            {/* List of expense records (TABLE LAYOUT) */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Records</h5>
                    <div className="flex gap-2">
                         <div className="text-xs text-gray-500 self-center dark:text-gray-400">
                            {filteredExpenses.length} record{filteredExpenses.length !== 1 ? 's' : ''} found
                         </div>
                         <button className="card-btn" onClick={() => generatePDF("Expense Report", filteredExpenses, ["expense-line-chart", "expense-doughnut-chart"], "expense")}>
                             <LuFileText className="text-base" /> PDF
                         </button>
                         <button className="card-btn" onClick={handleDownloadExpense}>
                            <LuDownload className="text-base" /> Excel
                         </button>
                    </div>
                </div>
                <TransactionsTable 
                    data={filteredExpenses} // CHANGED
                    onEdit={handleEditClick}
                    onDelete={handleDeleteExpense}
                    type="expense"
                />
            </div>
          </div>
        )}

        {/* Modal for adding/editing expense record */}
        <Modal
          isOpen={openAddExpenseModal}
          onClose={handleModalClose}
          title={editingExpense ? "Edit Expense" : "Add Expense"}
        >
          <AddExpenseForm 
            onAddExpense={handleSaveExpense} 
            closeModal={handleModalClose} 
            editingData={editingExpense}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
