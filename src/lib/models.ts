export type SupportCallStatus =
  | "Created"
  | "Transcribing"
  | "Processing"
  | "Processed";

export type SupportCall = {
  id: string;
  url: string;
  keyterms: string[];
  tags: string[];
  status: SupportCallStatus;
  dgRequestId?: string;
  dgResponse?: any;
};

export type Database = {
  [key: string]: SupportCall;
};

export type SubmissionQueue = string[];

export type ProcessingQueue = string[];
