import { ProcessingQueue } from "@/lib/models";

export const processingQueue: ProcessingQueue = [];

export function addToProcessingQueue(id: string): string {
  processingQueue.push(id);
  return id;
}

export function getNextFromProcessingQueue(): string | null {
  return processingQueue.shift() || null;
}
