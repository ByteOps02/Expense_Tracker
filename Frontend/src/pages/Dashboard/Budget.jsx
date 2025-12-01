import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Modal from '../../components/layouts/Modal';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import BudgetOverview from '../../components/Budget/BudgetOverview';
import BudgetList from '../../components/Budget/BudgetList';
import AddBudgetForm from '../../components/Budget/AddBudgetForm'; // Will be created in next step
import LoadingSpinner from '../../components/LoadingSpinner';


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

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    handleChange(name, type === 'checkbox' ? checked : value);
  };

  const openAddModal = () => {
    setEditingBudget(null);
    setFormData({
      category: '',
      amount: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
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
      }
      catch (err) {
        setError('Failed to delete budget.');
        console.error('Error deleting budget:', err);
      }
    }
  };


  if (loading) {
    return <DashboardLayout><div className="flex items-center justify-center min-h-[400px]"><LoadingSpinner text="Loading budget data..." /></div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout>
            <div className="card">
                <div className="text-center text-red-500 py-8">
                    <p>{error}</p>
                    <button onClick={fetchBudgetsAndReport} className="mt-4 btn-primary">
                        Retry
                    </button>
                </div>
            </div>
          </DashboardLayout>;
  }


  return (
    <DashboardLayout activeMenu="Budget">
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Budget Management</h1>

        <div className="space-y-6">
            <BudgetOverview
                onAddBudget={openAddModal}
                reportStartDate={reportStartDate}
                setReportStartDate={setReportStartDate}
                reportEndDate={reportEndDate}
                setReportEndDate={setReportEndDate}
            />

            {/* Budget vs Actual Chart (Placeholder for now) */}
            {budgetReport.length > 0 && (
                <div className="card mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Budget vs. Actual Spending</h2>
                    <div className="h-[300px]">
                        {/* <ChartJsBarChart data={chartData} /> */}
                        <p className="text-gray-600 dark:text-gray-400">Chart will be displayed here.</p>
                    </div>
                </div>
            )}

            {budgetReport.length === 0 ? (
                <div className="card">
                    <p className="text-gray-700 dark:text-gray-300">No budgets set yet. Add your first budget!</p>
                </div>
            ) : (
                <BudgetList budgetReport={budgetReport} onEdit={openEditModal} onDelete={handleDelete} />
            )}
        </div>


        {/* Add/Edit Budget Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingBudget ? 'Edit Budget' : 'Add New Budget'}>
            <AddBudgetForm
                formData={formData}
                handleChange={handleChange}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                editingBudget={editingBudget}
                closeModal={closeModal}
            />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Budget;
