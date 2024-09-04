'use client';

import { useState } from 'react';

type ResultStatus = 'success' | 'error' | 'idle';

interface FileUploadProps {
  onResultUpdate: (count: number | null, error: string | null, status: ResultStatus, didYouMean: string | null) => void;
}

export default function FileUpload({ onResultUpdate }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<{ count: number | null; error: string | null; status: ResultStatus; didYouMean: string | null }>({ count: null, error: null, status: 'idle', didYouMean: null });

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      handleResultUpdate(null, 'Please select a file.', 'error', null);
      return;
    }

    // Clear previous results
    handleResultUpdate(null, null, 'idle', null);

    setLoading(true);
    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-and-ocr', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        setDocumentId(result.documentId);
        setUploadStatus('success');
        handleResultUpdate(null, 'File uploaded and processed successfully.', 'success', null);
      } else {
        setUploadStatus('error');
        handleResultUpdate(null, result.error || 'An error occurred while processing your file.', 'error', null);
      }
    } catch (error) {
      setUploadStatus('error');
      handleResultUpdate(null, 'An error occurred while uploading and processing your file.', 'error', null);
    } finally {
      setLoading(false);
    }
  };

  const handleCountOccurrences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId || !query) {
      handleResultUpdate(null, 'Please upload a file and enter a bird name.', 'error', null);
      return;
    }

    setLoading(true);
    handleResultUpdate(null, null, 'idle', null); // Clear previous results

    try {
      const response = await fetch('/api/query-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId, query }),
      });
      const result = await response.json();
      if (response.ok) {
        handleResultUpdate(result.count, null, 'success', result.didYouMean || null);
      } else {
        handleResultUpdate(null, result.error || 'An error occurred while counting occurrences.', 'error', null);
      }
    } catch (error) {
      handleResultUpdate(null, 'An error occurred while counting occurrences.', 'error', null);
    } finally {
      setLoading(false);
    }
  };

  const handleResultUpdate = (count: number | null, error: string | null, status: ResultStatus, didYouMean: string | null) => {
    setResult({ count, error, status, didYouMean });
    onResultUpdate(count, error, status, didYouMean);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleFileUpload} className="space-y-4">
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Upload PDF
          </label>
          <input
            type="file"
            id="file"
            accept=".pdf"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              // Clear previous results when a new file is selected
              handleResultUpdate(null, null, 'idle', null);
            }}
            className="mt-1 block w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !file}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload and Process File'}
        </button>
      </form>

      {uploadStatus === 'success' && (
        <form onSubmit={handleCountOccurrences} className="space-y-4">
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700">
              Bird Name
            </label>
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-1 block w-full border-gray-300 text-black rounded-md shadow-sm"
              placeholder="Enter bird name"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Counting...' : 'Count Occurrences'}
          </button>
          {result.didYouMean && (
            <p className="text-sm text-gray-600">
              Did you mean: <button 
                type="button" 
                className="text-blue-600 underline" 
                onClick={() => setQuery(result.didYouMean!)}
              >
                {result.didYouMean}
              </button>?
            </p>
          )}
        </form>
      )}

      {uploadStatus === 'error' && (
        <p className="text-red-600">Error uploading file. Please try again.</p>
      )}
    </div>
  );
}