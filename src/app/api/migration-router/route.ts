import { NextRequest, NextResponse } from "next/server";
import { SupportCall } from "@/lib/models";
import { writeDatabase } from "@/mock-system/database";
import { addToSubmissionQueue } from "@/mock-system/dg-submission-queue";
import { routeToDeepgramPercent } from "@/lib/config";
import { NewSupportCallReq } from "@/lib/models";

// receives a support call id and url, creates entry in database, route to deepgram submission queue
export async function POST(request: NextRequest) {
  const { id, url, keyterms, tags }: NewSupportCallReq = await request.json();

  // code to route to existing messaging system

  // Only route a certain amount of traffic to Deepgram
  if (Math.random() * 100 >= routeToDeepgramPercent) {
    return NextResponse.json(
      { message: "Not routed to Deepgram", id, url },
      { status: 200 },
    );
  }

  // Create new support call entry
  const supportCall: SupportCall = {
    id,
    url,
    keyterms,
    tags,
    status: "Created",
  };

  writeDatabase(supportCall);

  addToSubmissionQueue(id);
  supportCall.tags.push("deepgram");

  return NextResponse.json(
    { message: "Support call stored successfully", id, url },
    { status: 201 },
  );
}
