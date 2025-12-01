import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Modal from '../../components/layouts/Modal';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import ChartJsBarChart from '../../components/Charts/ChartJsBarChart'; // Import Bar Chart

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const Budget = () => {
  const { user } = useContext(UserContext);
  const [budgets, setBudgets] = useState([]);
  const [budgetReport, setBudgetReport] = useState([]); // State for budget vs actual report
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [reportStartDate, setReportStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1); // Default to last month
    return d.toISOString().split('T')[0];
  });
  const [reportEndDate, setReportEndDate] = useState(new Date().toISOString().split('T')[0]);


  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    startDate: '',
    endDate: '',
    isRecurring: false,
    recurrenceType: '',
  });

  const fetchBudgetsAndReport = async () => {
    setLoading(true);
    try {
      const budgetsResponse = await axiosInstance.get('/api/v1/budgets');
      setBudgets(budgetsResponse.data);

      const reportResponse = await axiosInstance.get(`/api/v1/budgets/report/actual-vs-budget?startDate=${reportStartDate}&endDate=${reportEndDate}`);
      setBudgetReport(reportResponse.data);

    } catch (err) {
      setError('Failed to fetch data.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetsAndReport();
  }, [reportStartDate, reportEndDate]); // Refetch when date range changes

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const openAddModal = () => {
    setEditingBudget(null);
    setFormData({
      category: '',
      amount: '',
      startDate: '',
      endDate: '',
      isRecurring: false,
      recurrenceType: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      startDate: budget.startDate ? new Date(budget.startDate).toISOString().split('T')[0] : '',
      endDate: budget.endDate ? new Date(budget.endDate).toISOString().split('T')[0] : '',
      isRecurring: budget.isRecurring,
      recurrenceType: budget.recurrenceType || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await axiosInstance.put(`/api/v1/budgets/${editingBudget._id}`, formData);
      } else {
        await axiosInstance.post('/api/v1/budgets', formData);
      }
      fetchBudgetsAndReport();
      closeModal();
    } catch (err) {
      setError('Failed to save budget.');
      console.error('Error saving budget:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await axiosInstance.delete(`/api/v1/budgets/${id}`);
        fetchBudgetsAndReport();
      } catch (err) {
        setError('Failed to delete budget.');
        console.error('Error deleting budget:', err);
      }
    }
  };

  // Prepare data for the bar chart
  const getChartData = () => {
    const labels = budgetReport.map(item => item.category);
    const budgetAmounts = budgetReport.map(item => item.budgetAmount);
    const actualSpents = budgetReport.map(item => item.actualSpent);

    return {
      labels,
      datasets: [
        {
          label: 'Budgeted Amount',
          data: budgetAmounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Actual Spent',
          data: actualSpents,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) {
    return <DashboardLayout><div className="text-center p-4">Loading data...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div className="text-center p-4 text-red-500">{error}</div></DashboardLayout>;
  }

  const chartData = getChartData();

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Budget Overview</h1>

        <div className="flex justify-between items-center mb-6">
            <button
                onClick={openAddModal}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
                Add New Budget
            </button>
            <div className="flex items-center space-x-4">
                <div>
                    <label htmlFor="reportStartDate" className="sr-only">Start Date</label>
                    <input
                        type="date"
                        id="reportStartDate"
                        value={reportStartDate}
                        onChange={(e) => setReportStartDate(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div>
                    <label htmlFor="reportEndDate" className="sr-only">End Date</label>
                    <input
                        type="date"
                        id="reportEndDate"
                        value={reportEndDate}
                        onChange={(e) => setReportEndDate(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            </div>
        </div>

        {/* Budget vs Actual Chart */}
        {budgetReport.length > 0 && (
            <div className="mb-8 p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Budget vs. Actual Spending</h2>
                <ChartJsBarChart data={chartData} />
            </div>
        )}

        {budgets.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No budgets set yet. Add your first budget!</p>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white my-4 px-6">Your Budgets</h2>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Budget Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actual Spent</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Remaining</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Period</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Recurring</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {budgetReport.map((budget) => ( // Use budgetReport for table display to show actual vs budget
                  <tr key={budget._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{budget.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(budget.budgetAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(budget.actualSpent)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${budget.remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>{formatCurrency(budget.remaining)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${budget.status === 'overspent' ? 'text-red-500' : 'text-green-500'}`}>{budget.status.replace('_', ' ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {budget.isRecurring ? budget.recurrenceType : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(budget)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 mr-4">Edit</button>
                      <button onClick={() => handleDelete(budget._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Budget Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingBudget ? 'Edit Budget' : 'Add New Budget'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <input
                type="text"
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                min="0"
              />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-text-white"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                id="isRecurring"
                name="isRecurring"
                type="checkbox"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Is Recurring?</label>
            </div>
            {formData.isRecurring && (
              <div>
                <label htmlFor="recurrenceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recurrence Type</label>
                <select
                  name="recurrenceType"
                  id="recurrenceType"
                  value={formData.recurrenceType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required={formData.isRecurring}
                >
                  <option value="">Select Type</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-700 sm:text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              >
                {editingBudget ? 'Update Budget' : 'Add Budget'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Budget;
