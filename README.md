# Project Description

## Problem Overview

- Migration strategy from the existing STT system to Deepgram within 60 days
- System needs to process 10,000 hours of audio per month (~330 hours per day)

- Requirements:
  - Minimal disruption to existing workflow
    - Gradual migration with parallel system during transition
  - Support for industry-specific terminology
  - Validation methodology to confirm accuracy improvements (improved WER)

## Solution Overview

<img src="public/architecture.png" alt="Migration to Deepgram Architecture" width="600">

- First, a new call is recorded, saved to a data store, and the information about the call (such as ID, URL, keyterms, etc.) is sent to the migration router.
- The migration router routes the call to the existing code, while routing a subset of the calls to the Deepgram STT system.
- The ID of the call is stored in the submission queue.
- When a submission worker is available, and is able to submit a call to Deepgram, it picks up the call from the submission queue and submits it to Deepgram.
- Deepgram processes the call and sends the response to the Deepgram webhook (1 hour of audio takes around 20 seconds to process).
- The Deepgram webhook receives the response from Deepgram, stores the response into the database, and creates a new entry in the processing queue.
- When a processing worker is available, it picks up the call from the processing queue, and processes the call. It can format the response from Deepgram to an existing format for existing integrations (database, transcripts, CRM, etc.)

# Instructions

### Environment Setup

1. Sign up for a tunneling service such as [Ngrok](https://ngrok.com/).

2. Create a `.env` file in the project root with the following variables:

```bash
DEEPGRAM_API_KEY=your_deepgram_api_key_here
DEEPGRAM_API_KEY_IDENTIFIER=your_deepgram_api_key_identifier_here
TUNNEL_URL=your-custom-domain
```

3. Run the development server

```bash
npm run dev
```

4. Start your tunnel (if using Ngrok)

```bash
ngrok http 3000
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

### Using the Dashboard

The following is the dashboard page:

<img src="public/dashboard.png" alt="Dashboard" width="600">

- The New Support Call form allows you to submit a new support call to the migration router. You can specify the audio URL, key terms, and tags.
- Press the New Support Call button to create a new call in the database and the submission queue.
- Press the Trigger Submission Worker button to submit the call to Deepgram.
- You will notice that the status of the call changes to "Transcribing" in the database.
- When the call is transcribed, the status will be changed to "Processing", and a new entry will be created in the processing queue.
- Press the Trigger Processing Worker button to process the call.
- You will notice that the status of the call changes to "Processed" in the database.
- You can view the response from Deepgram by clicking on the call in the database.

# Suggested Implementation Timeline

- Phase 1: Infrastructure (Days 1-10)
  - Clone the `audoir/deepgram-project` repository into local development environment, get that working, and use that as a reference for the implementation
  - Add migration router functionality to existing system
  - Set up any infrastructure necessary for parallel system for Deepgram STT
  - Collect industry specific terminology (key terms), tags, and test dataset

- Phase 2: Implementation and Testing (Days 11-20)
  - Implement the submission queue, submission worker, webhook, processing queue, and processing worker with basic functionality to process calls through the workflow
  - Run some test calls through the new system to ensure it works as expected

- Phase 3: Testing and Using Production Data (Days 21-30)
  - Run tests and compare WER between the old and new systems
  - Route some production traffic to the new Deepgram STT system using the migration router, and continue implementation where needed

- Phase 4: Enable Parallel Processing for 50% of Production Traffic (Days 31-40)
  - Add observability to monitor system performance and errors
  - Run 50% of production traffic to new Deepgram STT system and scale as needed

- Phase 5: Enable Parallel Processing for 100% of Production Traffic (Days 41-50)
  - Run 100% of production traffic to new Deepgram STT system and scale as needed

- Phase 6: Gradual Rollout from Old System to New System (Days 51-60)
  - Gradually route traffic from the old system to the new system, using the migration router

# File Descriptions

### Configurations and Types

- `src/lib/config.ts`: Configurations such as default audio URL, key terms, etc.
- `src/lib/models.ts`: Types for the database, submission queue, and processing queue.

### Main Components

- `src/app/api/migration-router/route.ts`: Migration router.
- `src/app/api/dg-submission-worker/route.ts`: Submission worker.
- `src/app/api/dg-webhook/route.ts`: Deepgram webhook.
- `src/app/api/dg-processing-worker/route.ts`: Processing worker.

### Mock Components

- `src/lib/database.ts`: Mock database.
- `src/lib/dg-submission-queue.ts`: Mock submission queue.
- `src/lib/dg-processing-queue.ts`: Mock processing queue.

### Other Components

- `src/app/page.tsx`: Dashboard UI.
- `src/app/api/observability/route.ts`: Observability endpoint.

# Deepgram Documentation

You can find the documentation for Deepgram [here](https://developers.deepgram.com/docs/pre-recorded-audio).
