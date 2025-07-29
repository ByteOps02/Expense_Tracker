import React from 'react';

const SkeletonLoader = ({ type = 'card', lines = 3, className = '' }) => {
  const animateClass = 'animate-pulse bg-gray-200 rounded';
  
  const loaders = {
    card: (
      <div className={`bg-white p-6 rounded-2xl shadow-md border border-gray-200/50 ${className}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 ${animateClass}`}></div>
          <div className="flex-1">
            <div className={`h-4 w-24 ${animateClass} mb-2`}></div>
            <div className={`h-6 w-32 ${animateClass}`}></div>
          </div>
        </div>
      </div>
    ),
    
    list: (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200/50">
            <div className={`w-10 h-10 ${animateClass} rounded-full`}></div>
            <div className="flex-1 space-y-2">
              <div className={`h-4 w-3/4 ${animateClass}`}></div>
              <div className={`h-3 w-1/2 ${animateClass}`}></div>
            </div>
            <div className={`w-16 h-6 ${animateClass} rounded`}></div>
          </div>
        ))}
      </div>
    ),
    
    table: (
      <div className={`bg-white rounded-lg border border-gray-200/50 overflow-hidden ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <div className={`h-6 w-32 ${animateClass}`}></div>
        </div>
        <div className="divide-y divide-gray-200">
          {Array.from({ length: lines }).map((_, index) => (
            <div key={index} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${animateClass} rounded-full`}></div>
                <div className="space-y-2">
                  <div className={`h-4 w-24 ${animateClass}`}></div>
                  <div className={`h-3 w-16 ${animateClass}`}></div>
                </div>
              </div>
              <div className={`w-20 h-6 ${animateClass} rounded`}></div>
            </div>
          ))}
        </div>
      </div>
    ),
    
    chart: (
      <div className={`bg-white p-6 rounded-2xl shadow-md border border-gray-200/50 ${className}`}>
        <div className={`h-6 w-32 ${animateClass} mb-4`}></div>
        <div className="flex items-end justify-between h-48">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex-1 mx-1">
              <div 
                className={`${animateClass} rounded-t`}
                style={{ 
                  height: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    ),
    
    form: (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className={`h-4 w-20 ${animateClass}`}></div>
            <div className={`h-12 w-full ${animateClass} rounded-lg`}></div>
          </div>
        ))}
        <div className={`h-12 w-full ${animateClass} rounded-lg mt-6`}></div>
      </div>
    )
  };

  return loaders[type] || loaders.card;
};

export default SkeletonLoader; 