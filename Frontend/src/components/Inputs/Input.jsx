import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";

const Input = ({
  value,
  onChange,
  placeholder,
  label,
  type,
  error,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      <div
        className={`input-box relative ${error ? "border-red-500" : ""}`}
      >
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400"
          onChange={onChange}
          placeholder={placeholder}
          {...rest}
        />
        {type === "password" && (
          <div className="flex items-center">
            {showPassword ? (
              <FaRegEye
                size={20}
                className="text-purple-600 cursor-pointer hover:text-purple-700 transition-colors"
                onClick={toggleShowPassword}
              />
            ) : (
              <FaRegEyeSlash
                size={20}
                className="text-purple-600 cursor-pointer hover:text-purple-700 transition-colors"
                onClick={toggleShowPassword}
              />
            )}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
