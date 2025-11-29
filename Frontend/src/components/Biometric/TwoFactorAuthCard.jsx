import React, { useState } from "react";

const TwoFactorAuthCard = ({ is2FAEnabled, onEnable2FA, onDisable2FA, isLoading, qrCodeImageUrl, onGenerate2FASecret }) => {
  const [token, setToken] = useState("");
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Two-Factor Authentication (2FA)</h2>
      <p className="text-gray-600 mb-4">
        Two-factor authentication adds an extra layer of security to your account by requiring a second verification step.
      </p>
      <p className={`font-medium ${is2FAEnabled ? "text-green-600" : "text-red-600"} mb-4`}>
        Status: {is2FAEnabled ? "Enabled" : "Disabled"}
      </p>

      {!is2FAEnabled && (
        <div className="mb-4">
          <button
            className="btn-outline px-4 py-2 rounded-md shadow-sm"
            onClick={() => {
              onGenerate2FASecret();
              setShowQR(true);
            }}
            disabled={isLoading}
          >
            Generate 2FA Secret
          </button>
        </div>
      )}

      {showQR && qrCodeImageUrl && !is2FAEnabled && (
        <div className="mb-4 text-center">
          <p className="text-gray-700 mb-2">Scan this QR code with your authenticator app:</p>
          <img src={qrCodeImageUrl} alt="2FA QR Code" className="mx-auto border p-2" />
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="2fa-token" className="block text-sm font-medium text-gray-700">
          Authenticator Code
        </label>
        <input
          type="text"
          id="2fa-token"
          className="mt-1 block w-full input-field"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength="6"
          disabled={isLoading}
        />
      </div>

      <div className="flex space-x-4">
        {!is2FAEnabled ? (
          <button
            className="btn-primary px-4 py-2 rounded-md shadow-sm"
            onClick={() => onEnable2FA(token)}
            disabled={isLoading || !token || !qrCodeImageUrl}
          >
            {isLoading ? "Enabling..." : "Enable 2FA"}
          </button>
        ) : (
          <button
            className="btn-secondary px-4 py-2 rounded-md shadow-sm"
            onClick={() => onDisable2FA(token)}
            disabled={isLoading || !token}
          >
            {isLoading ? "Disabling..." : "Disable 2FA"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuthCard;