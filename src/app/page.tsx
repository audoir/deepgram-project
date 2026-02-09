"use client";

import { useState } from "react";
import { useSystemState } from "@/hooks/useSystemState";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { EventControls } from "@/components/EventControls";
import { SystemState } from "@/components/SystemState";
import { DgResponseModal } from "@/components/ui/DgResponseModal";

export default function Home() {
  const { systemState, lastUpdated, error, setError } = useSystemState();
  const [showDgResponseModal, setShowDgResponseModal] = useState(false);
  const [selectedDgResponse, setSelectedDgResponse] = useState<any>(null);

  const handleDgResponseClick = (dgResponse: any) => {
    setSelectedDgResponse(dgResponse);
    setShowDgResponseModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {error && <ErrorDisplay error={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EventControls onError={setError} />
          <SystemState
            systemState={systemState}
            lastUpdated={lastUpdated}
            onDgResponseClick={handleDgResponseClick}
          />
        </div>

        <DgResponseModal
          isOpen={showDgResponseModal}
          onClose={() => setShowDgResponseModal(false)}
          dgResponse={selectedDgResponse}
        />
      </div>
    </div>
  );
}
