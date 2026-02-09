import type { SystemState } from "@/lib/models";
import { SupportCallDatabase } from "./SupportCallDatabase";
import { QueueDisplay } from "./ui/QueueDisplay";

interface SystemStateProps {
  systemState: SystemState | null;
  lastUpdated: Date | null;
  onDgResponseClick: (dgResponse: any) => void;
}

export function SystemState({
  systemState,
  lastUpdated,
  onDgResponseClick,
}: SystemStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">System State</h2>
        <div className="text-sm text-gray-500">
          {lastUpdated
            ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
            : "Loading..."}
        </div>
      </div>

      {systemState ? (
        <div className="space-y-6">
          <SupportCallDatabase
            database={systemState.supportCallDb}
            onDgResponseClick={onDgResponseClick}
          />

          <QueueDisplay
            title="Submission Queue"
            items={systemState.submissionQueue}
          />

          <QueueDisplay
            title="Processing Queue"
            items={systemState.processingQueue}
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading system state...</p>
        </div>
      )}
    </div>
  );
}
