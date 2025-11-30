import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { FiLock } from "react-icons/fi";
import { motion } from "framer-motion";

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long.");
        return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      setSuccess(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <DashboardLayout activeMenu="Settings">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Settings</h3>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiLock className="text-purple-600" /> Change Password
          </h4>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}
            {success && <p className="text-green-500 text-sm bg-green-50 p-2 rounded-lg">{success}</p>}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-2.5 font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors duration-200 shadow-lg shadow-purple-200 cursor-pointer"
            >
              Change Password
            </motion.button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
