import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getNextFromSubmissionQueue } from "@/lib/dg-submission-queue";
import { isLessThanMaxConcurrentReqs, readDatabase } from "@/lib/database";

export async function GET(request: NextRequest) {
  // check if we are under deepgram max concurrent requests
  if (!isLessThanMaxConcurrentReqs) {
    return NextResponse.json(
      { error: "Deepgram max concurrent requests reached" },
      { status: 429 },
    );
  }

  // get next support call id from submission queue
  const id = getNextFromSubmissionQueue();
  if (!id) {
    return NextResponse.json(
      { error: "No support call in submission queue" },
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

  // create async remote file job
  const dgParams: Record<string, string> = {
    model: "nova-3",
    smart_format: "true",
    diarize: "true",
    callback: `${process.env.TUNNEL_URL}/api/dg-webhook`,
  };
  let queryString = new URLSearchParams(dgParams).toString();
  if (supportCall.keyterms.length > 0) {
    queryString =
      queryString +
      "&keyterm=" +
      supportCall.keyterms
        .map((keyterm) => encodeURIComponent(keyterm))
        .join("+");
  }
  // console.log(queryString);

  let dgSttRspData;
  try {
    const dgSttRsp = await axios.post(
      `https://api.deepgram.com/v1/listen?${queryString}`,
      { url: supportCall.url },
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    dgSttRspData = dgSttRsp.data;
  } catch (err) {
    // handle errors here (429, 500, etc.)
    console.error(err);
    return NextResponse.json(
      {
        error: "Failed to submit support call to Deepgram",
      },
      { status: 500 },
    );
  }

  // update support call info in database
  supportCall.dgRequestId = dgSttRspData.request_id;
  supportCall.status = "Transcribing";

  return NextResponse.json({
    message:
      "Support call submitted to Deepgram with request id: " +
      dgSttRspData.request_id,
  });
}
