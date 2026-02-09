interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
      <div className="flex">
        <div className="text-red-800">
          <strong>Error:</strong> {error}
        </div>
      </div>
    </div>
  );
}
