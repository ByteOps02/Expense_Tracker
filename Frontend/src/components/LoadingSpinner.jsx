import React from 'react';

const LoadingSpinner = ({ fullScreen = false, text = "Loading...", size = "medium" }) => {
  const sizeMap = {
    small: "w-4 h-4",
    medium: "w-8 h-8", 
    large: "w-12 h-12"
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`${spinnerSize} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}></div>
      {text && (
        <p className="mt-2 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner; 