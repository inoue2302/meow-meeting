"use server";

import { streamText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { createStreamableValue } from "@ai-sdk/rsc";
import { meetingSchema } from "@/lib/schema";
import { buildPrompt } from "@/lib/prompt";
import { consumeRateLimit, peekRateLimit } from "@/lib/rate-limit";
import { RateLimitedError } from "@/lib/errors";
import { validateHearingInput } from "@/lib/validate-hearing";

export async function generateMeeting(input: unknown) {
  let body;
  try {
    body = validateHearingInput(input);
  } catch {
    throw new Error("入力が正しくないにゃ");
  }

  // レート制限（バリデーション通過後に消費）
  try {
    const { allowed } = await consumeRateLimit();
    if (!allowed) throw new RateLimitedError();
  } catch (e) {
    if (e instanceof RateLimitedError) throw e;
    // Redis障害時はフェイルオープン
  }

  const stream = createStreamableValue();

  (async () => {
    try {
      const { partialOutputStream } = streamText({
        model: anthropic("claude-sonnet-4-6-20250514"),
        output: Output.object({ schema: meetingSchema }),
        prompt: buildPrompt(body),
        temperature: 1,
      });

      for await (const partialObject of partialOutputStream) {
        stream.update(partialObject);
      }

      stream.done();
    } catch (e) {
      stream.error(e instanceof Error ? e : new Error("Stream failed"));
    }
  })();

  return { object: stream.value };
}

export async function checkLimit() {
  try {
    const { allowed, remaining } = await peekRateLimit();
    return { allowed, remaining };
  } catch {
    return { allowed: true, remaining: -1 };
  }
}
