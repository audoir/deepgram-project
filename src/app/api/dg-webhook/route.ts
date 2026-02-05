import { NextRequest, NextResponse } from "next/server";
import { getMatchingRequestId } from "@/lib/database";
import { addToProcessingQueue } from "@/lib/dg-processing-queue";

export async function POST(request: NextRequest) {
  try {
    // Get the dg-token header for authentication
    const dgToken = request.headers.get("dg-token");

    // Authenticate by comparing with DEEPGRAM_API_KEY_IDENTIFIER
    if (!dgToken || dgToken !== process.env.DEEPGRAM_API_KEY_IDENTIFIER) {
      console.log("Authentication failed - invalid or missing dg-token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // find matching support call
    const dgRequestId = body.metadata.request_id;
    const supportCall = getMatchingRequestId(dgRequestId);
    if (!supportCall) {
      console.error(
        "No matching support call found for request id: " + dgRequestId,
      );
      return NextResponse.json({}, { status: 200 });
    }

    // update support call info in database
    supportCall.dgResponse = body;
    supportCall.status = "Processing";

    // add to processing queue
    addToProcessingQueue(supportCall.id);

    // Return success response
    return NextResponse.json(
      { message: "Webhook received successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing Deepgram webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
