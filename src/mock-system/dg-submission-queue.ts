import { SubmissionQueue } from "@/lib/models";

export const submissionQueue: SubmissionQueue = [];

export function addToSubmissionQueue(id: string): string {
  submissionQueue.push(id);
  return id;
}

export function getNextFromSubmissionQueue(): string | null {
  return submissionQueue.shift() || null;
}