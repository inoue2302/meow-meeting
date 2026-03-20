"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { readStreamableValue } from "@ai-sdk/rsc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CatIcon } from "@/components/CatIcon";
import { RateLimitedScreen } from "@/components/RateLimitedScreen";
import { MeetingResult } from "@/lib/schema";
import { HearingResult, CatName, isCatName } from "@/lib/types";
import { PokapokaBattle } from "@/components/PokapokaBattle";
import { Conclusion } from "@/components/Conclusion";
import { generateMeeting } from "@/app/actions";

interface MeetingProps {
  hearing: HearingResult;
  onReset: () => void;
}

interface ConfirmedMessage {
  cat: CatName;
  text: string;
}

type MeetingPhase = "streaming" | "done" | "pokapoka" | "conclusion" | "error" | "rate-limited";

// partialObjectの型
interface PartialMeetingObject {
  messages?: Array<{ cat?: string; text?: string } | undefined>;
  conclusion?: string;
  strategies?: Array<string | undefined>;
  finalWord?: string;
}

export function Meeting({ hearing, onReset }: MeetingProps) {
  const [phase, setPhase] = useState<MeetingPhase>("streaming");
  const [confirmedMessages, setConfirmedMessages] = useState<ConfirmedMessage[]>([]);
  const [streamingMsg, setStreamingMsg] = useState<{ cat: string; text: string } | null>(null);
  const [finalResult, setFinalResult] = useState<MeetingResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const submittedRef = useRef(false);

  // Server Action でストリーミング開始
  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    let confirmedUpTo = 0; // この位置まで確定済み

    (async () => {
      try {
        const { object } = await generateMeeting(hearing);

        let lastObject: PartialMeetingObject | null = null;

        for await (const partialObject of readStreamableValue(object)) {
          if (!partialObject) continue;
          lastObject = partialObject as PartialMeetingObject;
          const messages = lastObject.messages ?? [];

          // 最後の1件以外は完成 → 確定
          const newCompleteUpTo = Math.max(0, messages.length - 1);

          if (newCompleteUpTo > confirmedUpTo) {
            const newConfirmed: ConfirmedMessage[] = messages
              .slice(confirmedUpTo, newCompleteUpTo)
              .flatMap((msg) => {
                if (msg?.cat && msg?.text && isCatName(msg.cat)) {
                  return [{ cat: msg.cat, text: msg.text }];
                }
                return [];
              });

            if (newConfirmed.length > 0) {
              setConfirmedMessages((prev) => [...prev, ...newConfirmed]);
            }
            confirmedUpTo = newCompleteUpTo;
          }

          // ストリーミング中の最後のメッセージ
          const lastMsg = messages[messages.length - 1];
          if (lastMsg?.cat && lastMsg?.text) {
            setStreamingMsg({ cat: lastMsg.cat, text: lastMsg.text });
          } else {
            setStreamingMsg(null);
          }
        }

        // ストリーム完了 → 最後のメッセージも確定
        if (lastObject?.messages) {
          const allMessages: ConfirmedMessage[] = lastObject.messages
            .flatMap((msg) => {
              if (msg?.cat && msg?.text && isCatName(msg.cat)) {
                return [{ cat: msg.cat, text: msg.text }];
              }
              return [];
            });

          setConfirmedMessages(allMessages);
          setStreamingMsg(null);

          const strategies = (lastObject.strategies ?? []).filter(
            (s): s is string => s !== undefined
          );

          if (lastObject.conclusion) {
            const result: MeetingResult = {
              messages: allMessages,
              conclusion: lastObject.conclusion,
              strategies: [
                strategies[0] ?? "",
                strategies[1] ?? "",
                strategies[2] ?? "",
              ],
              finalWord: lastObject.finalWord ?? "",
            };
            setFinalResult(result);
            setPhase("done");
          }
        }

        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        const msg = e instanceof Error ? e.message : "";
        if (msg === "RATE_LIMITED") {
          setPhase("rate-limited");
        } else {
          setPhase("error");
        }
      }
    })();
  }, [hearing]);

  // 自動スクロール（メッセージ確定時のみ）
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [confirmedMessages.length, scrollToBottom]);

  // ストリーミング中のスクロール追従
  useEffect(() => {
    if (streamingMsg?.text && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  });

  const handlePokapokaComplete = useCallback(() => setPhase("conclusion"), []);

  const handleRetry = useCallback(() => {
    submittedRef.current = false;
    setPhase("streaming");
    setConfirmedMessages([]);
    setStreamingMsg(null);
    setFinalResult(null);
    setIsLoading(true);
  }, []);

  if (phase === "rate-limited") {
    return <RateLimitedScreen onReset={onReset} />;
  }

  if (phase === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <p className="text-red-600 text-lg">会議の準備に失敗したにゃ...</p>
        <Button
          onClick={handleRetry}
          className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
        >
          もう一度試すにゃ
        </Button>
      </div>
    );
  }

  if (phase === "pokapoka") {
    return <PokapokaBattle onComplete={handlePokapokaComplete} />;
  }

  if (phase === "conclusion" && finalResult) {
    return (
      <Conclusion
        conclusion={finalResult.conclusion}
        strategies={finalResult.strategies}
        finalWord={finalResult.finalWord}
        onReset={onReset}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 max-w-md mx-auto w-full">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-4">
        {confirmedMessages.map((msg, i) => (
          <ChatBubble key={`msg-${i}`} msg={msg} index={i} />
        ))}

        {streamingMsg && isCatName(streamingMsg.cat) && (
          <ChatBubble
            msg={{ cat: streamingMsg.cat, text: streamingMsg.text }}
            index={confirmedMessages.length}
            isStreaming
          />
        )}

        {isLoading && !streamingMsg?.text && (
          <div className="flex justify-start animate-fade-in items-center">
            <Card className="bg-white border-amber-200">
              <CardContent className="px-4 py-3">
                <div className="flex gap-1.5 items-center h-5">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {phase === "done" && (
        <div className="pt-4 border-t border-amber-200 animate-fade-in">
          <Button
            onClick={() => setPhase("pokapoka")}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 rounded-xl cursor-pointer"
          >
            結果を見るにゃ 🐾
          </Button>
        </div>
      )}
    </div>
  );
}

function ChatBubble({
  msg,
  index,
  isStreaming,
}: {
  msg: ConfirmedMessage;
  index: number;
  isStreaming?: boolean;
}) {
  const isLeft = index % 2 === 0;
  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"}`}>
      {isLeft && (
        <CatIcon
          name={msg.cat}
          size={56}
          className="mr-1 shrink-0 self-center"
        />
      )}
      <Card
        className={`max-w-[75%] ${
          isStreaming ? "transition-all duration-200 ease-out" : ""
        } ${
          isLeft
            ? "bg-white border-amber-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <CardContent className="px-4 py-3">
          <p className="text-xs font-bold text-amber-600 mb-1">{msg.cat}</p>
          <p className={`text-sm ${isStreaming ? "min-h-[1.25rem]" : ""}`}>
            {msg.text}
          </p>
        </CardContent>
      </Card>
      {!isLeft && (
        <CatIcon
          name={msg.cat}
          size={56}
          className="ml-1 shrink-0 self-center"
        />
      )}
    </div>
  );
}
