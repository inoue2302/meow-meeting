import { z } from "zod";
import { CAT_NAMES } from "@/lib/types";

export const meetingSchema = z.object({
  messages: z.array(
    z.object({
      cat: z.enum(CAT_NAMES),
      text: z.string(),
    })
  ),
  conclusion: z.string(),
  strategies: z.array(z.string()),
  finalWord: z.string(),
});

export type MeetingResult = z.infer<typeof meetingSchema>;
