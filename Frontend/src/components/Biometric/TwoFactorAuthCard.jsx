import React from "react";

const TwoFactorAuthCard = ({ is2FAEnabled, onEnable2FA, onDisable2FA, isLoading }) => {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Two-Factor Authentication (2FA)</h2>
      <p className="text-gray-600 mb-4">
        Two-factor authentication adds an extra layer of security to your account by requiring a second verification step.
      </p>
      <p className={`font-medium ${is2FAEnabled ? "text-green-600" : "text-red-600"} mb-4`}>
        Status: {is2FAEnabled ? "Enabled" : "Disabled"}
      </p>
      <div className="flex space-x-4">
        {!is2FAEnabled ? (
          <button
            className="btn-primary px-4 py-2 rounded-md shadow-sm"
            onClick={onEnable2FA}
            disabled={isLoading}
          >
            {isLoading ? "Enabling..." : "Enable 2FA"}
          </button>
        ) : (
          <button
            className="btn-secondary px-4 py-2 rounded-md shadow-sm"
            onClick={onDisable2FA}
            disabled={isLoading}
          >
            {isLoading ? "Disabling..." : "Disable 2FA"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuthCard;