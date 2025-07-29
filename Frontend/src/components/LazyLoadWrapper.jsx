import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';
import SkeletonLoader from './SkeletonLoader';

const LazyLoadWrapper = ({ 
  children, 
  fallback = 'spinner',
  fallbackProps = {},
  skeletonType = 'card'
}) => {
  const getFallback = () => {
    switch (fallback) {
      case 'spinner':
        return <LoadingSpinner size="lg" text="Loading..." />;
      case 'skeleton':
        return <SkeletonLoader type={skeletonType} />;
      case 'custom':
        return fallbackProps.component;
      default:
        return <LoadingSpinner size="lg" text="Loading..." />;
    }
  };

  return (
    <Suspense fallback={getFallback()}>
      {children}
    </Suspense>
  );
};

export default LazyLoadWrapper; 