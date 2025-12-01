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