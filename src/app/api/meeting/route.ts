import { streamText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { meetingSchema } from "@/lib/schema";
import { buildPrompt } from "@/lib/prompt";
import { themes } from "@/lib/data/themes";

const hearingResultSchema = z.object({
  themeId: z.number(),
  answers: z.array(z.string().max(200)).max(5),
});

export const maxDuration = 30;

export async function POST(request: Request) {
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

    return result.toTextStreamResponse();
  } catch {
    return new Response(JSON.stringify({ error: "API error" }), {
      status: 502,
    });
  }
}
