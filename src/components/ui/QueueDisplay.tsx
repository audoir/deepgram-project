interface QueueDisplayProps {
  title: string;
  items: string[];
  emptyMessage?: string;
}

export function QueueDisplay({
  title,
  items,
  emptyMessage = "Queue is empty",
}: QueueDisplayProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 mb-3">
        {title} ({items.length} items)
      </h3>
      <div className="bg-gray-50 rounded-md p-4 max-h-48 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-gray-500 italic">{emptyMessage}</p>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="bg-white rounded border p-3">
                <div className="font-medium text-gray-800">
                  Position {index + 1}: {item}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
