import { z } from "zod";
import { themes } from "@/lib/data/themes";
import { HearingResult } from "@/lib/types";

const hearingResultSchema = z.object({
  themeId: z.number(),
  answers: z.array(z.string().trim().max(200)),
});

/** 入力をバリデーションし、テーマとの整合性を検証する */
export function validateHearingInput(input: unknown): HearingResult {
  const parsed = hearingResultSchema.safeParse(input);
  if (!parsed.success) {
    console.error("[validateHearingInput] schema error:", parsed.error.format());
    throw new Error("Invalid request");
  }

  const { themeId, answers } = parsed.data;

  const theme = themes.find((t) => t.id === themeId);
  if (!theme) {
    throw new Error("Invalid themeId");
  }

  if (answers.length !== theme.questions.length) {
    throw new Error("Invalid answers count");
  }

  const answersMatchOptions = answers.every(
    (a, i) => theme.questions[i]?.options.includes(a)
  );
  if (!answersMatchOptions) {
    throw new Error("Invalid answers");
  }

  return { themeId, answers };
}
