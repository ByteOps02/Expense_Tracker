import React, { useEffect, useState } from 'react'
import DashboardLayout from "../../components/layouts/DashboardLayout"
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);

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
              onAddIncome={() => console.log("Add income clicked")}
            />

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Income