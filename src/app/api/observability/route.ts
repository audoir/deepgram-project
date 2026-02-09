import { NextRequest, NextResponse } from "next/server";
import { supportCallDb } from "@/mock-system/database";
import { submissionQueue } from "@/mock-system/dg-submission-queue";
import { processingQueue } from "@/mock-system/dg-processing-queue";
import { SystemState } from "@/lib/models";

export async function GET(request: NextRequest) {
  const systemState: SystemState = {
    supportCallDb,
    submissionQueue,
    processingQueue,
  };
  return NextResponse.json(systemState);
}
