import { NextRequest, NextResponse } from "next/server";
import { supportCallDb } from "@/lib/database";
import { submissionQueue } from "@/lib/dg-submission-queue";
import { processingQueue } from "@/lib/dg-processing-queue";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    supportCallDb,
    submissionQueue,
    processingQueue,
  });
}
