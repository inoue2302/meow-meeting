import { z } from "zod";
import { themes } from "@/lib/data/themes";
import { HearingResult } from "@/lib/types";

const hearingResultSchema = z.object({
  themeId: z.number(),
  answers: z.array(z.string().max(200)).min(1).max(5),
});

/** 入力をバリデーションし、テーマとの整合性を検証する */
export function validateHearingInput(input: unknown): HearingResult {
  const parsed = hearingResultSchema.safeParse(input);
  if (!parsed.success) {
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

  const allValid = answers.every(
    (a, i) => theme.questions[i]?.options.includes(a)
  );
  if (!allValid) {
    throw new Error("Invalid answers");
  }

  return { themeId, answers };
}
