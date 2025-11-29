import React from "react";

const PasskeyList = ({ passkeys, onDelete }) => {
  return (
    <>
      {passkeys.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {passkeys.map((passkey) => (
              <li
                key={passkey.credID}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <span className="text-gray-700 font-medium truncate">{passkey.credID}</span>
                <button
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                  onClick={() => onDelete(passkey.credID)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No passkeys registered yet. Add one to enhance your security.</p>
      )}
    </>
  );
};

export default PasskeyList;