import React, { useEffect, useState } from 'react'
import DashboardLayout from "../../components/layouts/DashboardLayout"
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import ExpenseList from '../../components/Expense/ExpenseList';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import Modal from '../../components/layouts/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false)
  
  const handleAddExpense = async (expenseData) => {
    try {
      const response = await axiosInstance.post(
        `${API_PATHS.EXPENSE.ADD_EXPENSE}`,
        expenseData
      );
      
      if (response.data) {
        console.log("Expense added successfully:", response.data);
        setOpenAddExpenseModal(false);
        // Refresh the expense data
        fetchExpenseDetails();
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId)}`
      );
      
      if (response.data) {
        console.log("Expense deleted successfully:", response.data);
        // Refresh the expense data
        fetchExpenseDetails();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  };

  const handleDownloadExpense = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.DOWNLOAD_EXPENSE}`,
        { responseType: 'blob' }
      );
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading expense:", error);
      alert("Failed to download expense data. Please try again.");
    }
  };
  
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      console.log("Expense API Response:", response.data);
      
      if (response.data && response.data.expenses) {
        setExpenseData(response.data.expenses);
      } else {
        console.log("No expense data found in response");
        setExpenseData([]);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    return () => { };
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>
          
          <div className=''>
            <ExpenseList
              transactions={expenseData}
              onDelete={handleDeleteExpense}
              onDownload={handleDownloadExpense}
            />
          </div>
        </div>
        
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

      </div>
    </DashboardLayout>
  )
}

export default Expense