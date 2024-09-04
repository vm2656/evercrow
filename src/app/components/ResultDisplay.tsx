import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ResultDisplayProps {
  count: number | null
  error: string | null
  status: 'success' | 'error' | 'idle'
}

export default function ResultDisplay({ count, error, status }: ResultDisplayProps) {
  if (status === 'idle') return null

  if (status === 'error') {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (status === 'success' && count !== null) {
    return (
      <Alert>
        <AlertTitle>Result</AlertTitle>
        <AlertDescription>
          The bird name appears <strong>{count}</strong> times in the uploaded PDF.
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
