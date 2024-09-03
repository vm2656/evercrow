'use client';

import { useState } from 'react';

interface ResultDisplayProps {
  count: number | null;
  error: string | null;
}

export default function ResultDisplay({ count, error }: ResultDisplayProps) {
  return (
    <div className="mt-8">
      {error && (
        <p className="text-red-600">{error}</p>
      )}
      {count !== null && (
        <p className="text-lg">
          The bird name appears <span className="font-bold">{count}</span> times in the uploaded PDF.
        </p>
      )}
    </div>
  );
}