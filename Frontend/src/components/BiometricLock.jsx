
import React, { useState } from "react";
import { Fingerprint } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import base64url from "base64url";

const BiometricLock = ({ onUnlock, onClose, email }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      if (!navigator.credentials || !navigator.credentials.get) {
        throw new Error(
          "Biometric authentication is not supported by this browser."
        );
      }

      const assertionOptions = await axiosInstance.post(
        "/api/v1/biometric/assertion/options",
        { email }
      );

      const credential = await navigator.credentials.get({
        publicKey: assertionOptions.data,
      });

      const response = await axiosInstance.post(
        "/api/v1/biometric/assertion/result",
        {
          id: credential.id,
          response: {
            clientDataJSON: base64url.encode(
              credential.response.clientDataJSON
            ),
            authenticatorData: base64url.encode(
              credential.response.authenticatorData
            ),
            signature: base64url.encode(credential.response.signature),
            userHandle: base64url.encode(credential.response.userHandle),
          },
        }
      );

      if (response.data.verified) {
        onUnlock(response.data.user, response.data.token);
      } else {
        throw new Error("Biometric authentication failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("Biometric authentication error:", err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Biometric Login</h2>
        <p className="text-gray-600 mb-6">
          Use your fingerprint or face to log in.
        </p>
        <div className="mb-6">
          <button
            onClick={handleBiometricAuth}
            disabled={isAuthenticating}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center"
          >
            <Fingerprint className="mr-2 h-5 w-5" />
            {isAuthenticating ? "Authenticating..." : "Login with Biometrics"}
          </button>
        </div>
        {error && (
          <div className="text-red-500 mt-4">
            <p>
              <strong>Error:</strong> {error}
            </p>
            <button
              onClick={handleBiometricAuth}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiometricLock;
