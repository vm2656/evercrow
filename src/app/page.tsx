'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

type ResultStatus = 'idle' | 'success' | 'error';

export default function Home() {
  const [result, setResult] = useState<{ count: number | null; error: string | null; status: ResultStatus }>({ 
    count: null,
    error: null,
    status: 'idle'
  });

  const handleResultUpdate = (count: number | null, error: string | null, status: ResultStatus) => {
    setResult({ count, error, status });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-3xl shadow-lg">
        <div className="p-8 space-y-8">
          <CardTitle className="text-3xl font-bold text-center text-gray-800">Evercrow Bird Name Counter</CardTitle>
          <CardDescription className="text-lg text-center text-gray-600">
            Upload a PDF file to count the occurrences of a bird name.
          </CardDescription>
          <FileUpload onResultUpdate={handleResultUpdate} />
          <ResultDisplay count={result.count} error={result.error} status={result.status} />
        </div>
      </Card>
    </main>
  );
}