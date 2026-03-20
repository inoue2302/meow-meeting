import { z } from "zod";

export const meetingSchema = z.object({
  messages: z.array(
    z.object({
      cat: z.enum(["モチ", "カゼ", "スミ", "トラ"]),
      text: z.string(),
    })
  ),
  conclusion: z.string(),
  strategies: z.array(z.string()).length(3),
  finalWord: z.string(),
});

export type MeetingResult = z.infer<typeof meetingSchema>;
