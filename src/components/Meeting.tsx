"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CatIcon } from "@/components/CatIcon";
import { meetingSchema, MeetingResult } from "@/lib/schema";
import { HearingResult, CatName } from "@/lib/types";
import { PokapokaBattle } from "@/components/PokapokaBattle";
import { Conclusion } from "@/components/Conclusion";

const POKAPOKA_TRANSITION_DELAY_MS = 1500;

interface MeetingProps {
  hearing: HearingResult;
  onReset: () => void;
}

interface ConfirmedMessage {
  cat: CatName;
  text: string;
}

type MeetingPhase = "streaming" | "pokapoka" | "conclusion";

export function Meeting({ hearing, onReset }: MeetingProps) {
  const { object, submit, isLoading, error } = useObject({
    api: "/api/meeting",
    schema: meetingSchema,
  });

  const [phase, setPhase] = useState<MeetingPhase>("streaming");
  const [confirmedMessages, setConfirmedMessages] = useState<ConfirmedMessage[]>([]);
  const [finalResult, setFinalResult] = useState<MeetingResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const submittedRef = useRef(false);
  const confirmedCountRef = useRef(0);

  // 初回マウント時にsubmit
  useEffect(() => {
    if (!submittedRef.current) {
      submittedRef.current = true;
      submit(hearing);
    }
  }, [hearing, submit]);

  const messages = object?.messages ?? [];

  // 完成したメッセージを確定（次のメッセージが来た = 前のは完成）
  useEffect(() => {
    const completedCount = isLoading
      ? Math.max(0, messages.length - 1)
      : messages.length;

    if (completedCount > confirmedCountRef.current) {
      const newConfirmed: ConfirmedMessage[] = [];
      for (let i = confirmedCountRef.current; i < completedCount; i++) {
        const msg = messages[i];
        if (msg?.cat && msg?.text) {
          newConfirmed.push({ cat: msg.cat as CatName, text: msg.text });
        }
      }
      if (newConfirmed.length > 0) {
        setConfirmedMessages((prev) => [...prev, ...newConfirmed]);
      }
      confirmedCountRef.current = completedCount;
    }
  }, [messages.length, isLoading, messages]);

  // ストリーミング中の最後のメッセージ
  const streamingMsg =
    isLoading && messages.length > confirmedCountRef.current
      ? messages[messages.length - 1]
      : null;

  // ストリーミング完了 → ポカポカへ
  useEffect(() => {
    if (
      !isLoading &&
      confirmedMessages.length > 0 &&
      phase === "streaming"
    ) {
      const strategies = (object?.strategies ?? []).filter(
        (s): s is string => s !== undefined
      );
      setFinalResult({
        messages: confirmedMessages,
        conclusion: object?.conclusion ?? "",
        strategies,
        finalWord: object?.finalWord ?? "",
      } as MeetingResult);

      const timer = setTimeout(
        () => setPhase("pokapoka"),
        POKAPOKA_TRANSITION_DELAY_MS
      );
      return () => clearTimeout(timer);
    }
  }, [isLoading, confirmedMessages.length, phase, object]);

  // 自動スクロール（smooth）
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
  }, [confirmedMessages.length, streamingMsg?.text, scrollToBottom]);

  const handlePokapokaComplete = useCallback(() => setPhase("conclusion"), []);

  const handleRetry = useCallback(() => {
    submittedRef.current = false;
    confirmedCountRef.current = 0;
    setPhase("streaming");
    setConfirmedMessages([]);
    setFinalResult(null);
    submit(hearing);
  }, [hearing, submit]);

  // エラー表示
  if (error) {
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
        {/* 確定済みメッセージ */}
        {confirmedMessages.map((msg, i) => (
          <MessageBubble key={`msg-${i}`} msg={msg} index={i} />
        ))}

        {/* ストリーミング中のメッセージ（リアルタイム表示） */}
        {streamingMsg?.cat && streamingMsg?.text && (
          <StreamingBubble
            cat={streamingMsg.cat as CatName}
            text={streamingMsg.text}
            index={confirmedMessages.length}
          />
        )}

        {/* タイピングインジケーター（まだテキストが来ていない時） */}
        {isLoading && (!streamingMsg?.text) && (
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
    </div>
  );
}

function MessageBubble({
  msg,
  index,
}: {
  msg: ConfirmedMessage;
  index: number;
}) {
  const isLeft = index % 2 === 0;
  return (
    <div
      className={`flex ${isLeft ? "justify-start" : "justify-end"}`}
    >
      {isLeft && (
        <CatIcon
          name={msg.cat}
          size={56}
          className="mr-1 shrink-0 self-center"
        />
      )}
      <Card
        className={`max-w-[75%] ${
          isLeft
            ? "bg-white border-amber-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <CardContent className="px-4 py-3">
          <p className="text-xs font-bold text-amber-600 mb-1">{msg.cat}</p>
          <p className="text-sm">{msg.text}</p>
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

function StreamingBubble({
  cat,
  text,
  index,
}: {
  cat: CatName;
  text: string;
  index: number;
}) {
  const isLeft = index % 2 === 0;
  return (
    <div
      className={`flex ${isLeft ? "justify-start" : "justify-end"}`}
    >
      {isLeft && (
        <CatIcon
          name={cat}
          size={56}
          className="mr-1 shrink-0 self-center"
        />
      )}
      <Card
        className={`max-w-[75%] transition-all duration-200 ease-out ${
          isLeft
            ? "bg-white border-amber-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <CardContent className="px-4 py-3">
          <p className="text-xs font-bold text-amber-600 mb-1">{cat}</p>
          <p className="text-sm min-h-[1.25rem]">{text}</p>
        </CardContent>
      </Card>
      {!isLeft && (
        <CatIcon
          name={cat}
          size={56}
          className="ml-1 shrink-0 self-center"
        />
      )}
    </div>
  );
}
