// Import necessary packages and components
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import ExpenseList from "../../components/Expense/ExpenseList";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import Modal from "../../components/layouts/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";

// Expense page component
const Expense = () => {
  // State variables for expense data, loading state, and modal visibility
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  /**
   * @desc    Handles adding a new expense record
   * @param   {object} expenseData - The new expense data from the form
   */
  const handleAddExpense = async (expenseData) => {
    try {
      const response = await axiosInstance.post(
        `${API_PATHS.EXPENSE.ADD_EXPENSE}`,
        expenseData,
      );

      if (response.data) {
        console.log("Expense added successfully:", response.data);
        setExpenseData((prevExpenses) => [...prevExpenses, response.data.expense]);
        setOpenAddExpenseModal(false);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  /**
   * @desc    Handles deleting an expense record
   * @param   {string} expenseId - The ID of the expense record to delete
   */
  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId)}`,
      );

      if (response.data) {
        console.log("Expense deleted successfully:", response.data);
        setExpenseData((prevExpenses) =>
          prevExpenses.filter((expense) => expense._id !== expenseId),
        );
      }
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
        { responseType: "blob" },
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
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`,
      );

      console.log("Expense API Response:", response.data);

      if (response.data && response.data.expenses) {
        setExpenseData(response.data.expenses);
      } else {
        console.log("No expense data found in response");
        setExpenseData([]);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch expense data on component mount
  useEffect(() => {
    fetchExpenseDetails();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          {/* Expense overview and add expense button */}
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          {/* List of expense records */}
          <div className="">
            <ExpenseList
              transactions={expenseData}
              onDelete={handleDeleteExpense}
              onDownload={handleDownloadExpense}
            />
          </div>
        </div>

        {/* Modal for adding a new expense record */}
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;