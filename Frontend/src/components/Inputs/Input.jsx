import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";

const Input = ({
  value,
  onChange,
  placeholder,
  label,
  type,
  error,
  className,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isFilled = value && value.length > 0;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const inputId = `input-${label.replace(/\s+/g, "-").toLowerCase()}`; // Unique ID for accessibility

  const inputElement =
    type === "textarea" ? (
      <textarea
        id={inputId}
        value={value}
        className={`peer w-full bg-transparent outline-none pt-4 pb-2 px-3 text-gray-900 placeholder-transparent transition-all duration-200`}
        onChange={onChange}
        placeholder={placeholder}
        rows={3} // Default rows for textarea
        {...rest}
      />
    ) : (
      <input
        id={inputId}
        type={
          type === "password" ? (showPassword ? "text" : "password") : type
        }
        value={value}
        className={`peer w-full bg-transparent outline-none pt-4 pb-2 px-3 text-gray-900 placeholder-transparent transition-all duration-200`}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
    );

  return (
    <div className={`relative border border-gray-300 rounded-lg focus-within:border-indigo-500 transition-all duration-200 ${error ? "border-red-500" : ""} ${className}`}>
      {inputElement}
      <label
        htmlFor={inputId}
        className={`absolute left-3 transition-all duration-200
          ${isFilled || type === "date"
            ? "top-1 text-xs text-gray-600"
            : "top-1/2 -translate-y-1/2 text-base text-gray-500 peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-600"
          }
          ${error ? "text-red-500 peer-focus:text-red-500" : ""}
        `}
      >
        {label}
      </label>
      {type === "password" && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {showPassword ? (
            <FaRegEye
              size={18}
              className="text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={toggleShowPassword}
            />
          ) : (
            <FaRegEyeSlash
              size={18}
              className="text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={toggleShowPassword}
            />
          )}
        </div>
      )}
      {error && <p className="absolute -bottom-5 left-3 text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
