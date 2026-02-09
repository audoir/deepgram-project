import { Database } from "@/lib/models";

interface SupportCallDatabaseProps {
  database: Database;
  onDgResponseClick: (dgResponse: any) => void;
}

export function SupportCallDatabase({
  database,
  onDgResponseClick,
}: SupportCallDatabaseProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 mb-3">
        Support Call Database
      </h3>
      <div className="bg-gray-50 rounded-md p-4 max-h-64 overflow-y-auto">
        {Object.keys(database).length === 0 ? (
          <p className="text-gray-500 italic">No support calls in database</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(database).map(([id, call]) => (
              <div
                key={id}
                className={`bg-white rounded border p-3 ${
                  call.dgResponse
                    ? "cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    : ""
                }`}
                onClick={() =>
                  call.dgResponse && onDgResponseClick(call.dgResponse)
                }
              >
                <div className="text-sm text-gray-800">ID: {id}</div>
                <div className="text-sm text-gray-800 mt-1">
                  URL: <span className="font-mono text-xs">{call.url}</span>
                </div>
                <div className="text-sm text-gray-800 mt-1">
                  Status: {call.status}
                </div>
                <div className="text-sm text-gray-800 mt-1">
                  Key Terms:{" "}
                  {call.keyterms && call.keyterms.length > 0
                    ? call.keyterms.join(", ")
                    : "None"}
                </div>
                <div className="text-sm text-gray-800 mt-1">
                  Tags:{" "}
                  {call.tags && call.tags.length > 0
                    ? call.tags.join(", ")
                    : "None"}
                </div>
                {call.dgResponse && (
                  <div className="text-xs text-blue-600 mt-2 font-medium">
                    📄 Click to view Deepgram response
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
