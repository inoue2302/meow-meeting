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

const MESSAGE_DISPLAY_DELAY_MS = 1200;
const POKAPOKA_TRANSITION_DELAY_MS = 1500;

interface MeetingProps {
  hearing: HearingResult;
  onReset: () => void;
}

interface ConfirmedMessage {
  cat: CatName;
  text: string;
}

type MeetingPhase =
  | "loading"
  | "displaying"
  | "pokapoka"
  | "conclusion";

export function Meeting({ hearing, onReset }: MeetingProps) {
  const { object, submit, isLoading, error } = useObject({
    api: "/api/meeting",
    schema: meetingSchema,
  });

  const [phase, setPhase] = useState<MeetingPhase>("loading");
  const [allMessages, setAllMessages] = useState<ConfirmedMessage[]>([]);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [finalResult, setFinalResult] = useState<MeetingResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const submittedRef = useRef(false);

  // 初回マウント時にsubmit
  useEffect(() => {
    if (!submittedRef.current) {
      submittedRef.current = true;
      submit(hearing);
    }
  }, [hearing, submit]);

  // ストリーミング完了 → メッセージを確定して表示フェーズへ
  useEffect(() => {
    if (!isLoading && phase === "loading") {
      if (object?.messages && object.messages.length > 0) {
        const msgs: ConfirmedMessage[] = (object.messages ?? [])
          .filter((m) => !!m?.cat && !!m?.text)
          .map((m) => ({ cat: m!.cat! as CatName, text: m!.text! }));

        const strategies = (object.strategies ?? []).filter(
          (s): s is string => s !== undefined
        );

        setAllMessages(msgs);
        setFinalResult({
          messages: msgs,
          conclusion: object.conclusion ?? "",
          strategies,
          finalWord: object.finalWord ?? "",
        } as MeetingResult);
        setPhase("displaying");
      } else if (!error) {
        // messagesが空でエラーもない → フォールバック
        setPhase("displaying");
      }
    }
  }, [isLoading, object, phase, error]);

  // メッセージを1つずつ遅延表示
  useEffect(() => {
    if (phase !== "displaying") return;
    if (displayedCount >= allMessages.length) {
      if (allMessages.length === 0) return;
      const timer = setTimeout(() => setPhase("pokapoka"), POKAPOKA_TRANSITION_DELAY_MS);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setDisplayedCount((prev) => prev + 1);
    }, MESSAGE_DISPLAY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [phase, displayedCount, allMessages.length]);

  // 自動スクロール
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [displayedCount, phase, scrollToBottom]);

  // 次に喋る猫
  const nextCat: CatName | null =
    phase === "displaying" && displayedCount < allMessages.length
      ? allMessages[displayedCount].cat
      : null;

  const handlePokapokaComplete = useCallback(() => setPhase("conclusion"), []);

  const handleRetry = useCallback(() => {
    submittedRef.current = false;
    setPhase("loading");
    setAllMessages([]);
    setDisplayedCount(0);
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

  // loading or displaying
  const showTypingIndicator =
    phase === "loading" ||
    (phase === "displaying" && displayedCount < allMessages.length);

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 max-w-md mx-auto w-full">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-4">
        {allMessages.slice(0, displayedCount).map((msg, i) => (
          <MessageBubble key={`msg-${i}`} msg={msg} index={i} />
        ))}

        {showTypingIndicator && (() => {
          const nextIndex = displayedCount;
          const isLeft = nextIndex % 2 === 0;
          return (
            <div className={`flex animate-fade-in items-center ${isLeft ? "justify-start" : "justify-end"}`}>
              {isLeft && nextCat && (
                <CatIcon name={nextCat} size={56} className="mr-1 shrink-0" />
              )}
              <Card className="bg-white border-amber-200">
                <CardContent className="px-4 py-3">
                  <div className="flex gap-1.5 items-center h-5">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </CardContent>
              </Card>
              {!isLeft && nextCat && (
                <CatIcon name={nextCat} size={56} className="ml-1 shrink-0" />
              )}
            </div>
          );
        })()}
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
      className={`flex animate-fade-in ${isLeft ? "justify-start" : "justify-end"}`}
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
