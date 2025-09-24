import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import base64url from "base64url";

const ManagePasskeys = () => {
  const [passkeys, setPasskeys] = useState([]);
  const [error, setError] = useState(null);

  const getPasskeys = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/biometric/passkeys");
      setPasskeys(response.data.passkeys);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch passkeys.");
    }
  };

  useEffect(() => {
    getPasskeys();
  }, []);

  const addPasskey = async () => {
    try {
      const attestationOptions = await axiosInstance.post(
        "/api/v1/biometric/attestation/options"
      );

      const credential = await navigator.credentials.create({
        publicKey: attestationOptions.data,
      });

      await axiosInstance.post("/api/v1/biometric/attestation/result", {
        attestationResponse: {
          clientDataJSON: base64url.encode(credential.response.clientDataJSON),
          attestationObject: base64url.encode(
            credential.response.attestationObject
          ),
        },
      });

      getPasskeys();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add passkey.");
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

  return (
    <DashboardLayout activeMenu="Security">
      <div className="my-5 mx-auto">
        <div className="card">
          <h5 className="text-lg">Manage Passkeys</h5>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="mt-6">
            <button className="btn-primary" onClick={addPasskey}>
              Add a Passkey
            </button>
          </div>
          <div className="mt-6">
            <h6 className="text-md">Your Passkeys</h6>
            <ul>
              {passkeys.map((passkey) => (
                <li
                  key={passkey.credID}
                  className="flex items-center justify-between mt-2"
                >
                  <span>{passkey.credID}</span>
                  <button
                    className="text-red-500"
                    onClick={() => deletePasskey(passkey.credID)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagePasskeys;
