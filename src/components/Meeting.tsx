"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { readStreamableValue } from "@ai-sdk/rsc";
import { Button } from "@/components/ui/button";
import { ChatBubble } from "@/components/ChatBubble";
import { TypingIndicator } from "@/components/TypingIndicator";
import { RateLimitedScreen } from "@/components/RateLimitedScreen";
import { MeetingResult } from "@/lib/schema";
import { HearingResult, isCatName } from "@/lib/types";
import {
  ConfirmedMessage,
  StreamingMeetingObject,
  toConfirmedMessages,
  buildFinalResult,
} from "@/lib/meeting-utils";
import { PokapokaBattle } from "@/components/PokapokaBattle";
import { Conclusion } from "@/components/Conclusion";
import { generateMeeting } from "@/app/actions";

interface MeetingProps {
  hearing: HearingResult;
  onReset: () => void;
}

type MeetingPhase =
  | "streaming"
  | "done"
  | "pokapoka"
  | "conclusion"
  | "error"
  | "rate-limited";

export function Meeting({ hearing, onReset }: MeetingProps) {
  const [phase, setPhase] = useState<MeetingPhase>("streaming");
  const [confirmedMessages, setConfirmedMessages] = useState<
    ConfirmedMessage[]
  >([]);
  const [streamingMsg, setStreamingMsg] = useState<{
    cat: string;
    text: string;
  } | null>(null);
  const [finalResult, setFinalResult] = useState<MeetingResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const submittedRef = useRef(false);

  // Server Action でストリーミング開始
  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    let confirmedUpTo = 0;

    (async () => {
      try {
        const { object } = await generateMeeting(hearing);
        let lastObject: StreamingMeetingObject | null = null;

        for await (const partialObject of readStreamableValue(object)) {
          if (!partialObject) continue;
          lastObject = partialObject as StreamingMeetingObject;
          const messages = lastObject.messages ?? [];
          const newCompleteUpTo = Math.max(0, messages.length - 1);

          // 完成したメッセージを確定
          if (newCompleteUpTo > confirmedUpTo) {
            const newConfirmed = toConfirmedMessages(
              messages.slice(confirmedUpTo, newCompleteUpTo)
            );
            if (newConfirmed.length > 0) {
              setConfirmedMessages((prev) => [...prev, ...newConfirmed]);
            }
            confirmedUpTo = newCompleteUpTo;
          }

          // ストリーミング中の最後のメッセージ
          const lastMsg = messages[messages.length - 1];
          setStreamingMsg(
            lastMsg?.cat && lastMsg?.text
              ? { cat: lastMsg.cat, text: lastMsg.text }
              : null
          );
        }

        // ストリーム完了
        handleStreamComplete(lastObject);
      } catch (e) {
        handleStreamError(e);
      }
    })();

    function handleStreamComplete(lastObject: StreamingMeetingObject | null) {
      setIsLoading(false);
      setStreamingMsg(null);

      if (!lastObject?.messages) {
        setPhase("error");
        return;
      }

      const allMessages = toConfirmedMessages(lastObject.messages);
      setConfirmedMessages(allMessages);

      const result = buildFinalResult(lastObject, allMessages);
      if (!result) {
        setPhase("error");
        return;
      }

      setFinalResult(result);
      setPhase("done");
    }

    function handleStreamError(e: unknown) {
      setIsLoading(false);
      if (e instanceof Error && e.message.includes("RATE_LIMITED")) {
        setPhase("rate-limited");
        return;
      }
      console.error("[Meeting] stream error:", e);
      setPhase("error");
    }
  }, [hearing, retryCount]);

  // 自動スクロール（メッセージ確定時のみ）
  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [confirmedMessages.length, scrollToBottom]);

  // ストリーミング中のスクロール追従
  useEffect(() => {
    if (streamingMsg?.text) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, [streamingMsg?.text]);

  const handlePokapokaComplete = useCallback(
    () => setPhase("conclusion"),
    []
  );

  const handleRetry = useCallback(() => {
    submittedRef.current = false;
    setPhase("streaming");
    setConfirmedMessages([]);
    setStreamingMsg(null);
    setFinalResult(null);
    setIsLoading(true);
    setRetryCount((prev) => prev + 1);
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
          <ChatBubble
            key={`msg-${i}`}
            cat={msg.cat}
            text={msg.text}
            isLeft={i % 2 === 0}
          />
        ))}

        {streamingMsg && isCatName(streamingMsg.cat) && (
          <ChatBubble
            cat={streamingMsg.cat}
            text={streamingMsg.text}
            isLeft={confirmedMessages.length % 2 === 0}
            isStreaming
          />
        )}

        {isLoading && !streamingMsg?.text && <TypingIndicator />}
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
