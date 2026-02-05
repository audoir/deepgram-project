import { Database, SupportCall } from "./models";
import { deepgramMaxConcurrentReqs } from "./config";

export const supportCallDb: Database = {};

export function readDatabase(id: string): SupportCall | null {
  return supportCallDb[id] || null;
}

export function writeDatabase(supportCall: SupportCall): void {
  supportCallDb[supportCall.id] = supportCall;
}

export function getMatchingRequestId(
  requestId: string,
): SupportCall | undefined {
  return Object.values(supportCallDb).find(
    (call) => call.dgRequestId === requestId,
  );
}

export function isLessThanMaxConcurrentReqs(): boolean {
  return (
    Object.values(supportCallDb).filter(
      (call) => call.status === "Transcribing",
    ).length < deepgramMaxConcurrentReqs
  );
}
