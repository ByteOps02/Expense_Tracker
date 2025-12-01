import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion'; // Import motion
import { LuTag, LuWallet, LuCalendar, LuPlus } from 'react-icons/lu'; // Import icons
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Modal from '../../components/layouts/Modal';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import ChartJsBarChart from '../../components/Charts/ChartJsBarChart';
import ModernDatePicker from '../../components/Inputs/ModernDatePicker'; // Import ModernDatePicker


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
  const [budgetReport, setBudgetReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [reportStartDate, setReportStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
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
  }, [reportStartDate, reportEndDate]);

  const handleChange = (key, value) => { // Modified handleChange to accept key and value directly
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInputChange = (e) => { // New handler for standard input elements
    const { name, value, type, checked } = e.target;
    handleChange(name, type === 'checkbox' ? checked : value);
  };

  const openAddModal = () => {
    setEditingBudget(null);
    setFormData({
      category: '',
      amount: '',
      startDate: new Date().toISOString().split('T')[0], // Default current date
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Default one month later
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
    <DashboardLayout activeMenu="Budget">
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Budget Overview</h1>

        <div className="flex justify-between items-center mb-6">
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={openAddModal}
                className="add-btn"
            >
                <LuPlus className="text-lg" />
                Add New Budget
            </motion.button>
            <div className="flex items-center space-x-4">
                <div>
                    <label htmlFor="reportStartDate" className="sr-only">Start Date</label>
                    <input
                        type="date"
                        id="reportStartDate"
                        value={reportStartDate}
                        onChange={(e) => setReportStartDate(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200"
                    />
                </div>
                <div>
                    <label htmlFor="reportEndDate" className="sr-only">End Date</label>
                    <input
                        type="date"
                        id="reportEndDate"
                        value={reportEndDate}
                        onChange={(e) => setReportEndDate(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200"
                    />
                </div>
            </div>
        </div>

        {/* Budget vs Actual Chart */}
        {budgetReport.length > 0 && (
            <div className="card mb-6 animate-bounceIn">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Budget vs. Actual Spending</h2>
                <div className="h-[300px]">
                    <ChartJsBarChart data={chartData} />
                </div>
            </div>
        )}

        {budgets.length === 0 ? (
          <div className="card animate-bounceIn">
            <p className="text-gray-700 dark:text-gray-300">No budgets set yet. Add your first budget!</p>
          </div>
        ) : (
          <div className="card animate-bounceIn">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Budgets</h2>
            <div className="overflow-x-auto">
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
                      {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
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
          </div>
        )}

        {/* Add/Edit Budget Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingBudget ? 'Edit Budget' : 'Add New Budget'}>
          <form onSubmit={handleSubmit} className="space-y-6"> {/* Changed space-y-4 to space-y-6 for consistency */}
            {/* Category */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Category <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                    <LuTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                    <input
                        type="text"
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        required
                    />
                </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                    <LuWallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                    <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        required
                        min="0"
                    />
                </div>
            </div>

            {/* Start Date */}
            <ModernDatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                name="startDate"
                colorTheme="purple"
            />
            {/* End Date */}
            <ModernDatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                name="endDate"
                colorTheme="purple"
            />

            <div className="flex items-center">
              <input
                id="isRecurring"
                name="isRecurring"
                type="checkbox"
                checked={formData.isRecurring}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Is Recurring?</label>
            </div>
            {formData.isRecurring && (
              <div className="space-y-2">
                <label htmlFor="recurrenceType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Recurrence Type</label>
                <select
                  name="recurrenceType"
                  id="recurrenceType"
                  value={formData.recurrenceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-500 dark:focus:border-purple-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={closeModal}
                className="w-auto py-3.5 px-6 font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg shadow-gray-200 dark:shadow-gray-900/30"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-auto py-3.5 px-6 font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {editingBudget ? 'Update Budget' : 'Add Budget'}
              </motion.button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Budget;