import { NextRequest, NextResponse } from "next/server";
import { SupportCall } from "@/lib/models";
import { writeDatabase } from "@/lib/database";
import { addToSubmissionQueue } from "@/lib/dg-submission-queue";
import { routeToDeepgramPercent } from "@/lib/config";

// receives a support call id and url, creates entry in database, route to deepgram submission queue
export async function POST(request: NextRequest) {
  const { id, url, keyterms, tags } = await request.json();

  // Create new support call entry
  const supportCall: SupportCall = {
    id,
    url,
    keyterms,
    tags,
    status: "Created",
  };

  writeDatabase(supportCall);

  // code to route to existing message queue

  // route to deepgram submission queue
  if (Math.random() * 100 < routeToDeepgramPercent) {
    addToSubmissionQueue(id);
    supportCall.tags.push("deepgram");
  }

  return NextResponse.json(
    { message: "Support call stored successfully", id, url },
    { status: 201 },
  );
}
