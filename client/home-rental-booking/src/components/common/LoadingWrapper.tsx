// src/components/common/LoadingWrapper.tsx
import React, { useEffect, useState } from 'react';
import { persistor } from '@/redux/storecache';

interface LoadingWrapperProps {
  children: React.ReactNode;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
  const [isRehydrated, setIsRehydrated] = useState(false);

  useEffect(() => {
    const handlePersistorState = () => {
      const { bootstrapped } = persistor.getState();
      if (bootstrapped) {
        setIsRehydrated(true);
      }
    };

    const unsubscribe = persistor.subscribe(handlePersistorState);
    handlePersistorState();

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isRehydrated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingWrapper;
