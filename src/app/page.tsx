'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';

export default function Home() {
  const [result, setResult] = useState<{ count: number | null; error: string | null }>({ count: null, error: null });

  const handleResultUpdate = (count: number | null, error: string | null) => {
    setResult({ count, error });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Evercrow Bird Name Counter</h1>
        <FileUpload onResultUpdate={handleResultUpdate} />
        <ResultDisplay count={result.count} error={result.error} />
      </div>
    </main>
  );
}