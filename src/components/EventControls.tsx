import { useState } from "react";
import { defaultAudioUrl, defaultKeyterms, defaultTags } from "@/lib/config";
import { NewSupportCallReq } from "@/lib/models";

interface EventControlsProps {
  onError: (error: string) => void;
}

export function EventControls({ onError }: EventControlsProps) {
  const [audioUrl, setAudioUrl] = useState(defaultAudioUrl);
  const [keyTerms, setKeyTerms] = useState(defaultKeyterms.join(", "));
  const [tags, setTags] = useState(defaultTags.join(", "));
  const [isLoading, setIsLoading] = useState(false);

  const createNewSupportCallReq = async () => {
    setIsLoading(true);
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

      const newSupportCallReq: NewSupportCallReq = {
        id: crypto.randomUUID(),
        url: audioUrl,
        keyterms: parsedKeyTerms,
        tags: parsedTags,
      };

      const response = await fetch("/api/migration-router", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSupportCallReq),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Migration router response:", result);
    } catch (err) {
      onError(
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
      onError(
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
      onError(
        err instanceof Error
          ? err.message
          : "Failed to trigger processing worker",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
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
              onClick={createNewSupportCallReq}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isLoading ? "Processing..." : "New Support Call"}
            </button>
          </div>
        </div>
      </div>

      {/* Worker Controls */}
      <div className="space-y-3">
        <button
          onClick={triggerSubmissionWorker}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isLoading ? "Processing..." : "Trigger Submission Worker"}
        </button>
        <button
          onClick={triggerProcessingWorker}
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isLoading ? "Processing..." : "Trigger Processing Worker"}
        </button>
      </div>
    </div>
  );
}
