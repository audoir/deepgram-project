import { NextRequest, NextResponse } from "next/server";
import { getNextFromProcessingQueue } from "@/lib/dg-processing-queue";
import { readDatabase } from "@/lib/database";

export async function GET(request: NextRequest) {
  // get next support call id from processing queue
  const id = getNextFromProcessingQueue();
  if (!id) {
    return NextResponse.json(
      { error: "No support call in processing queue" },
      { status: 404 },
    );
  }

  // get support call info from database
  const supportCall = readDatabase(id);
  if (!supportCall) {
    return NextResponse.json(
      { error: "Support call not found" },
      { status: 404 },
    );
  }

  // process the transcript
  supportCall.status = "Processed";
  // calculate accuracy against test dataset; word error rate (WER)
  // can also build eval using other STT systems if no test dataset is available
  // format deepgram's response to an existing format for existing integrations (database, transcripts, CRM, etc.)

  // return the response from deepgram webhook
  return NextResponse.json(
    { message: "Support call processed successfully" },
    { status: 200 },
  );
}
