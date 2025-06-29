import React from "react";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="p-8 text-center text-gray-500 text-sm animate-pulse space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
    </div>
  );
};

export default LoadingSkeleton;
