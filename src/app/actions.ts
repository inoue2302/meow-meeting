"use server";

import { streamText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { createStreamableValue } from "@ai-sdk/rsc";
import { meetingSchema } from "@/lib/schema";
import { buildPrompt } from "@/lib/prompt";
import { themes } from "@/lib/data/themes";
import { consumeRateLimit, peekRateLimit } from "@/lib/rate-limit";
import { RateLimitedError } from "@/lib/errors";

const hearingResultSchema = z.object({
  themeId: z.number(),
  answers: z.array(z.string().max(200)).min(1).max(5),
});

export async function generateMeeting(input: unknown) {
  // バリデーション
  const parsed = hearingResultSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Invalid request");
  }
  const body = parsed.data;

  // ホワイトリスト検証（レート制限消費の前に実施）
  const theme = themes.find((t) => t.id === body.themeId);
  if (!theme) {
    throw new Error("Invalid themeId");
  }
  if (body.answers.length !== theme.questions.length) {
    throw new Error("Invalid answers count");
  }
  const valid = body.answers.every(
    (a, i) => theme.questions[i]?.options.includes(a)
  );
  if (!valid) {
    throw new Error("Invalid answers");
  }

  // レート制限（バリデーション通過後に消費）
  try {
    const { allowed } = await consumeRateLimit();
    if (!allowed) {
      throw new RateLimitedError();
    }
  } catch (e) {
    if (e instanceof RateLimitedError) throw e;
    // Redis障害時はフェイルオープン
  }

  const stream = createStreamableValue();

  (async () => {
    try {
      const { partialOutputStream } = streamText({
        model: anthropic("claude-sonnet-4-20250514"),
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
