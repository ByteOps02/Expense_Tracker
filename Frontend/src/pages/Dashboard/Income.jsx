import React, { useEffect, useState } from 'react'
import DashboardLayout from "../../components/layouts/DashboardLayout"
import IncomeOverview from '../../components/Income/IncomeOverview';
import IncomeList from '../../components/Income/IncomeList';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import Modal from '../../components/layouts/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false)
  
  const handleAddIncome = async (incomeData) => {
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
    }
  };

  const handleDeleteIncome = async (incomeId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_PATHS.INCOME.DELETE_INCOME(incomeId)}`
      );
      
      if (response.data) {
        console.log("Income deleted successfully:", response.data);
        // Refresh the income data
        fetchIncomeDetails();
      }
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income. Please try again.");
    }
  };

  const handleDownloadIncome = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.DOWNLOAD_INCOME}`,
        { responseType: 'blob' }
      );
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading income:", error);
      alert("Failed to download income data. Please try again.");
    }
  };
  
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

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
    } catch (error) {
      console.log("Something went wrong.Please try again.", error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
    return () => { };
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
          
          <div className=''>
            <IncomeList
              transactions={incomeData}
              onDelete={handleDeleteIncome}
              onDownload={handleDownloadIncome}
            />
          </div>
        </div>
        
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

      </div>
    </DashboardLayout>
  )
}

export default Income