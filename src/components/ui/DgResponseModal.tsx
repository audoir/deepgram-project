interface DgResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  dgResponse: any;
}

export function DgResponseModal({
  isOpen,
  onClose,
  dgResponse,
}: DgResponseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Deepgram Response
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <pre className="bg-gray-50 rounded-md p-4 text-sm overflow-auto whitespace-pre-wrap text-gray-800">
            {dgResponse
              ? JSON.stringify(dgResponse, null, 2)
              : "No response data"}
          </pre>
        </div>
        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
