import { streamText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { meetingSchema } from "@/lib/schema";
import { buildPrompt } from "@/lib/prompt";
import { HearingResult } from "@/lib/types";

export const maxDuration = 30;

export async function POST(request: Request) {
  const body = (await request.json()) as HearingResult;

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    output: Output.object({ schema: meetingSchema }),
    prompt: buildPrompt(body),
    temperature: 1,
  });

  return result.toTextStreamResponse();
}
