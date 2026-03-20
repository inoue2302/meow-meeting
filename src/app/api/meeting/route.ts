import { streamText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { headers } from "next/headers";
import { meetingSchema } from "@/lib/schema";
import { buildPrompt } from "@/lib/prompt";
import { themes } from "@/lib/data/themes";
import { checkRateLimit } from "@/lib/rate-limit";

const hearingResultSchema = z.object({
  themeId: z.number(),
  answers: z.array(z.string().max(200)).max(5),
});

export const maxDuration = 30;

export async function POST(request: Request) {
  // レート制限
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "今日はもう相談しすぎにゃ...明日また来てにゃ" }),
      {
        status: 429,
        headers: { "X-RateLimit-Remaining": "0" },
      }
    );
  }

  let body;
  try {
    body = hearingResultSchema.parse(await request.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }

  // ホワイトリスト検証
  const theme = themes.find((t) => t.id === body.themeId);
  if (!theme) {
    return new Response(JSON.stringify({ error: "Invalid themeId" }), {
      status: 400,
    });
  }
  const valid = body.answers.every(
    (a, i) => theme.questions[i]?.options.includes(a)
  );
  if (!valid) {
    return new Response(JSON.stringify({ error: "Invalid answers" }), {
      status: 400,
    });
  }

  try {
    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      output: Output.object({ schema: meetingSchema }),
      prompt: buildPrompt(body),
      temperature: 1,
    });

    const response = result.toTextStreamResponse();
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  } catch {
    return new Response(JSON.stringify({ error: "API error" }), {
      status: 502,
    });
  }
}
