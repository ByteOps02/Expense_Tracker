import React, { useState, useEffect, useCallback } from 'react'
import { useUserAuth } from "../../hooks/useUserAuth"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { axiosInstance } from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import ExpenseOverview from '../../components/Expense/ExpenseOverview'

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenseDetails = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        setExpenseData(response.data);
      }
    }
    catch (error) {
      console.log("Something went wrong.Please try again", error)
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchExpenseDetails();
    return () => { };
  }, [fetchExpenseDetails]);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => {}}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expense