'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    handleResultUpdate(null, null, 'idle', null);

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
          <Label htmlFor="file">Upload PDF</Label>
          <Input
            type="file"
            id="file"
            accept=".pdf"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              handleResultUpdate(null, null, 'idle', null);
            }}
          />
        </div>
        <Button type="submit" disabled={loading || !file}>
          {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload and Process File'}
        </Button>
      </form>

      {uploadStatus === 'success' && (
        <form onSubmit={handleCountOccurrences} className="space-y-4">
          <div>
            <Label htmlFor="query">Bird Name</Label>
            <Input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter bird name"
            />
          </div>
          <Button type="submit" disabled={loading || !query}>
            {loading ? 'Counting...' : 'Count Occurrences'}
          </Button>
          {result.didYouMean && (
            <p className="text-sm text-gray-600">
              Did you mean:{' '}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setQuery(result.didYouMean!)}
              >
                {result.didYouMean}
              </Button>
              ?
            </p>
          )}
        </form>
      )}

      {uploadStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Error uploading file. Please try again.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}