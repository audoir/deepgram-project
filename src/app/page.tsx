"use client";

import { useState, useEffect } from "react";
import { Database, SubmissionQueue, ProcessingQueue } from "@/lib/models";
import { defaultAudioUrl, defaultKeyterms, defaultTags } from "@/lib/config";

interface SystemState {
  supportCallDb: Database;
  submissionQueue: SubmissionQueue;
  processingQueue: ProcessingQueue;
}

export default function Home() {
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showDgResponseModal, setShowDgResponseModal] = useState(false);
  const [selectedDgResponse, setSelectedDgResponse] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState(defaultAudioUrl);
  const [keyTerms, setKeyTerms] = useState(defaultKeyterms.join(", "));
  const [tags, setTags] = useState(defaultTags.join(", "));

  // Poll observability endpoint every 2 seconds
  useEffect(() => {
    const fetchSystemState = async () => {
      try {
        const response = await fetch("/api/observability");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSystemState(data);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch system state",
        );
      }
    };

    // Initial fetch
    fetchSystemState();

    // Set up polling interval
    const interval = setInterval(fetchSystemState, 2000);

    return () => clearInterval(interval);
  }, []);

  const triggerMigrationRouter = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Parse key terms from input (split by comma or newline and trim)
      const parsedKeyTerms = keyTerms
        .split(/[,\n]/)
        .map((term) => term.trim())
        .filter((term) => term.length > 0);

      // Parse tags from input (split by comma or newline and trim)
      const parsedTags = tags
        .split(/[,\n]/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await fetch("/api/migration-router", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          url: audioUrl,
          keyterms: parsedKeyTerms,
          tags: parsedTags,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Migration router response:", result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to trigger migration router",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const triggerSubmissionWorker = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dg-submission-worker", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Submission worker response:", result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to trigger submission worker",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const triggerProcessingWorker = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dg-processing-worker", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Processing worker response:", result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to trigger processing worker",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDgResponseClick = (dgResponse: any) => {
    setSelectedDgResponse(dgResponse);
    setShowDgResponseModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Deepgram Project Dashboard
        </h1>

        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Event Controls
          </h2>

          {/* New Support Call Form */}
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              New Support Call
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="audioUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Audio URL
                </label>
                <input
                  id="audioUrl"
                  type="url"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Enter audio URL"
                />
              </div>
              <div>
                <label
                  htmlFor="keyTerms"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Key Terms (comma or newline separated)
                </label>
                <textarea
                  id="keyTerms"
                  value={keyTerms}
                  onChange={(e) => setKeyTerms(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Enter key terms separated by commas or newlines"
                />
              </div>
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tags (comma or newline separated)
                </label>
                <textarea
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Enter tags separated by commas or newlines"
                />
              </div>
              <div className="mt-4">
                <button
                  onClick={triggerMigrationRouter}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {isLoading ? "Processing..." : "New Support Call"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-x-4">
            <button
              onClick={triggerSubmissionWorker}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isLoading ? "Processing..." : "Trigger Submission Worker"}
            </button>
            <button
              onClick={triggerProcessingWorker}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isLoading ? "Processing..." : "Trigger Processing Worker"}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}

        {/* System State Display */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              System State
            </h2>
            <div className="text-sm text-gray-500">
              {lastUpdated
                ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
                : "Loading..."}
            </div>
          </div>

          {systemState ? (
            <div className="space-y-6">
              {/* Support Call Database */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Support Call Database
                </h3>
                <div className="bg-gray-50 rounded-md p-4">
                  {Object.keys(systemState.supportCallDb).length === 0 ? (
                    <p className="text-gray-500 italic">
                      No support calls in database
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(systemState.supportCallDb).map(
                        ([id, call]) => (
                          <div
                            key={id}
                            className={`bg-white rounded border p-3 ${
                              call.dgResponse
                                ? "cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                : ""
                            }`}
                            onClick={() =>
                              call.dgResponse &&
                              handleDgResponseClick(call.dgResponse)
                            }
                          >
                            <div className="text-sm text-gray-800">
                              ID: {id}
                            </div>
                            <div className="text-sm text-gray-800 mt-1">
                              URL:{" "}
                              <span className="font-mono text-xs">
                                {call.url}
                              </span>
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
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Queue */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Submission Queue ({systemState.submissionQueue.length} items)
                </h3>
                <div className="bg-gray-50 rounded-md p-4">
                  {systemState.submissionQueue.length === 0 ? (
                    <p className="text-gray-500 italic">Queue is empty</p>
                  ) : (
                    <div className="space-y-2">
                      {systemState.submissionQueue.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded border p-3"
                        >
                          <div className="font-medium text-gray-800">
                            Position {index + 1}: {item}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Processing Queue */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Processing Queue ({systemState.processingQueue.length} items)
                </h3>
                <div className="bg-gray-50 rounded-md p-4">
                  {systemState.processingQueue.length === 0 ? (
                    <p className="text-gray-500 italic">Queue is empty</p>
                  ) : (
                    <div className="space-y-2">
                      {systemState.processingQueue.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded border p-3"
                        >
                          <div className="font-medium text-gray-800">
                            Position {index + 1}: {item}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading system state...</p>
            </div>
          )}
        </div>

        {/* Modal for DG Response */}
        {showDgResponseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Deepgram Response
                </h3>
                <button
                  onClick={() => setShowDgResponseModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <pre className="bg-gray-50 rounded-md p-4 text-sm overflow-auto whitespace-pre-wrap text-gray-800">
                  {selectedDgResponse
                    ? JSON.stringify(selectedDgResponse, null, 2)
                    : "No response data"}
                </pre>
              </div>
              <div className="p-6 border-t">
                <button
                  onClick={() => setShowDgResponseModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
