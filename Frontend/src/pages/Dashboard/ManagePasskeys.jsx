import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import base64url from "base64url";
import Modal from "../../components/layouts/Modal"; // Import Modal
import AddPasskeyForm from "../../components/Biometric/AddPasskeyForm"; // Import AddPasskeyForm
import TwoFactorAuthCard from "../../components/Biometric/TwoFactorAuthCard"; // Import TwoFactorAuthCard
import RecentLoginActivityCard from "../../components/Biometric/RecentLoginActivityCard"; // Import RecentLoginActivityCard
import ChangePasswordCard from "../../components/Biometric/ChangePasswordCard"; // Import ChangePasswordCard
import PasskeyList from "../../components/Biometric/PasskeyList"; // Import PasskeyList

const ManagePasskeys = () => {
  const [passkeys, setPasskeys] = useState([]);
  const [error, setError] = useState(null);
  const [openAddPasskeyModal, setOpenAddPasskeyModal] = useState(false); // State for modal visibility
  const [isAddingPasskey, setIsAddingPasskey] = useState(false); // State for loading during passkey addition
  const [is2FAEnabled, setIs2FAEnabled] = useState(false); // State for 2FA status
  const [is2FAManaging, setIs2FAManaging] = useState(false); // State for loading during 2FA management
  const [recentActivities, setRecentActivities] = useState([]); // State for recent login activities
  const [isChangingPassword, setIsChangingPassword] = useState(false); // State for loading during password change

  const getPasskeys = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/v1/biometric/passkeys");
      setPasskeys(response.data.passkeys);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch passkeys.");
    }
  }, []);

  // Placeholder function for fetching 2FA status
  const fetch2FAStatus = useCallback(async () => {
    try {
      // Simulate API call
      // In a real application, this would be an actual API call to your backend
      const response = await new Promise(resolve => setTimeout(() => resolve({ data: { enabled: false } }), 500));
      setIs2FAEnabled(response.data.enabled);
    } catch (err) {
      console.error("Failed to fetch 2FA status:", err);
      // Optionally set an error state here
    }
  }, []);

  // Placeholder function for fetching recent login activities
  const fetchRecentActivities = useCallback(async () => {
    try {
      // Simulate API call
      // In a real application, this would be an actual API call to your backend
      const response = await new Promise(resolve => setTimeout(() => resolve({
        data: [
          { message: "Login from Chrome on Windows", timestamp: "November 29, 2025, 10:30 AM", status: "Successful" },
          { message: "Login attempt from unknown device", timestamp: "November 29, 2025, 10:25 AM", status: "Failed" },
          { message: "Login from Firefox on Mac", timestamp: "November 28, 2025, 09:00 AM", status: "Successful" },
        ]
      }), 700));
      setRecentActivities(response.data);
    } catch (err) {
      console.error("Failed to fetch recent activities:", err);
      // Optionally set an error state here
    }
  }, []);

  useEffect(() => {
    getPasskeys();
    fetch2FAStatus(); // Fetch 2FA status on component mount
    fetchRecentActivities(); // Fetch recent login activities on component mount
  }, [getPasskeys, fetch2FAStatus, fetchRecentActivities]);

  const addPasskey = async () => {
    setIsAddingPasskey(true); // Set loading to true
    try {
      const attestationOptions = await axiosInstance.post(
        "/api/v1/biometric/attestation/options",
      );

      const credential = await navigator.credentials.create({
        publicKey: attestationOptions.data,
      });

      await axiosInstance.post("/api/v1/biometric/attestation/result", {
        attestationResponse: {
          clientDataJSON: base64url.encode(credential.response.clientDataJSON),
          attestationObject: base64url.encode(
            credential.response.attestationObject,
          ),
        },
      });

      getPasskeys();
      setOpenAddPasskeyModal(false); // Close modal on success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add passkey.");
    } finally {
      setIsAddingPasskey(false); // Set loading to false
    }
  };

  const deletePasskey = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/biometric/passkeys/${id}`);
      getPasskeys();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete passkey.");
    }
  };

  // Placeholder function to enable 2FA
  const enable2FA = async () => {
    setIs2FAManaging(true);
    try {
      // Simulate API call to enable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIs2FAEnabled(true);
      alert("Two-Factor Authentication Enabled!");
    } catch (err) {
      console.error("Error enabling 2FA:", err);
      alert("Failed to enable 2FA.");
    } finally {
      setIs2FAManaging(false);
    }
  };

  // Placeholder function to disable 2FA
  const disable2FA = async () => {
    setIs2FAManaging(true);
    try {
      // Simulate API call to disable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIs2FAEnabled(false);
      alert("Two-Factor Authentication Disabled!");
    } catch (err) {
      console.error("Error disabling 2FA:", err);
      alert("Failed to disable 2FA.");
    } finally {
      setIs2FAManaging(false);
    }
  };

  // Placeholder function to change password
  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    setIsChangingPassword(true);
    try {
      // Simulate API call to change password
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Password changed successfully:", { currentPassword, newPassword });
      // In a real app, you'd make an axios call here
      // For example: await axiosInstance.post("/api/v1/auth/change-password", { currentPassword, newPassword });
      return { success: true, message: "Password changed successfully!" };
    } catch (err) {
      console.error("Error changing password:", err);
      throw new Error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Security">
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <div className="space-y-6">
          {/* Security Overview Card */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Security Overview</h2>
            <p className="text-gray-600">
              Manage your account's security settings, including passkeys, two-factor authentication, and recent activity.
            </p>
          </div>

          {/* Manage Passkeys Section */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Passkeys</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end mb-4">
              <button className="btn-primary px-4 py-2 rounded-md shadow-sm" onClick={() => setOpenAddPasskeyModal(true)}>
                Add New Passkey
              </button>
            </div>
            <PasskeyList passkeys={passkeys} onDelete={deletePasskey} />
          </div>

          {/* Two-Factor Authentication (2FA) Card */}
          <TwoFactorAuthCard
            is2FAEnabled={is2FAEnabled}
            onEnable2FA={enable2FA}
            onDisable2FA={disable2FA}
            isLoading={is2FAManaging}
          />

          {/* Recent Login Activity Card */}
          <RecentLoginActivityCard activities={recentActivities} />

          {/* Change Password Card */}
          <ChangePasswordCard onChangePassword={handleChangePassword} isLoading={isChangingPassword} />
        </div>
      </div>

      {/* Modal for adding a new passkey */}
      <Modal
        isOpen={openAddPasskeyModal}
        onClose={() => setOpenAddPasskeyModal(false)}
        title="Add New Passkey"
      >
        <AddPasskeyForm onAddPasskey={addPasskey} error={error} isLoading={isAddingPasskey} />
      </Modal>
    </DashboardLayout>
  );
};

export default ManagePasskeys;
