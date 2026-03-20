import { CatName, isCatName } from "@/lib/types";
import { MeetingResult } from "@/lib/schema";

export interface ConfirmedMessage {
  cat: CatName;
  text: string;
}

// MeetingResultからDeepPartialを導出
export type PartialMeetingObject = {
  [K in keyof MeetingResult]?: MeetingResult[K] extends Array<infer U>
    ? Array<U extends object ? { [P in keyof U]?: U[P] } : U | undefined>
    : MeetingResult[K];
};

/** partial messagesからConfirmedMessage[]に変換 */
export function toConfirmedMessages(
  messages: Array<{ cat?: string; text?: string } | undefined>
): ConfirmedMessage[] {
  return messages.flatMap((msg) => {
    if (msg?.cat && msg?.text && isCatName(msg.cat)) {
      return [{ cat: msg.cat, text: msg.text }];
    }
    return [];
  });
}

/** PartialMeetingObjectからMeetingResultを構築。conclusionが無ければnull */
export function buildFinalResult(
  obj: PartialMeetingObject,
  allMessages: ConfirmedMessage[]
): MeetingResult | null {
  if (!obj.conclusion) return null;

  const strategies = (obj.strategies ?? []).filter(
    (s): s is string => s !== undefined
  );

  return {
    messages: allMessages,
    conclusion: obj.conclusion,
    strategies: [
      strategies[0] ?? "",
      strategies[1] ?? "",
      strategies[2] ?? "",
    ],
    finalWord: obj.finalWord ?? "",
  };
}
