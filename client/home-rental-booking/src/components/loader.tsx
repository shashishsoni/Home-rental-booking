import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Loader className="w-8 h-8 animate-spin text-purple-600" />
    </div>
  );
};

export default LoadingSpinner;
