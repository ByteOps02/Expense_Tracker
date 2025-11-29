import React from "react";

const AddPasskeyForm = ({ onAddPasskey, error, isLoading }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Register a New Passkey</h3>
      <p className="text-gray-600 text-sm mb-4">
        Passkeys provide a simple and secure way to log in without passwords.
        They use your device's biometric sensors (e.g., fingerprint, face ID) or a PIN.
      </p>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        onClick={onAddPasskey}
        className="btn-primary w-full py-2"
        disabled={isLoading}
      >
        {isLoading ? "Adding Passkey..." : "Add New Passkey"}
      </button>
    </div>
  );
};

export default AddPasskeyForm;