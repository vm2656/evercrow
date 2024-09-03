import { useState } from 'react';

interface ResultDisplayProps {
  count: number | null;
  error: string | null;
  status: 'success' | 'error' | 'idle';
}

export default function ResultDisplay({ count, error, status }: ResultDisplayProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="mt-8">
      {error && (
        <p className={`${getStatusColor()} font-medium`}>{error}</p>
      )}
      {count !== null && (
        <p className={`${getStatusColor()} text-lg`}>
          The bird name appears <span className="font-bold">{count}</span> times in the uploaded PDF.
        </p>
      )}
    </div>
  );
}
