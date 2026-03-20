"use client";

import { useEffect, useRef, useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Card, CardContent } from "@/components/ui/card";
import { CatIcon } from "@/components/CatIcon";
import { meetingSchema } from "@/lib/schema";
import { HearingResult, CatName } from "@/lib/types";
import { PokapokaBattle } from "@/components/PokapokaBattle";
import { Conclusion } from "@/components/Conclusion";

interface MeetingProps {
  hearing: HearingResult;
  onReset: () => void;
}

export function Meeting({ hearing, onReset }: MeetingProps) {
  const { object, submit, isLoading } = useObject({
    api: "/api/meeting",
    schema: meetingSchema,
  });

  const [phase, setPhase] = useState<"meeting" | "pokapoka" | "conclusion">(
    "meeting"
  );
  const [displayedCount, setDisplayedCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 初回マウント時にsubmit
  useEffect(() => {
    if (!submitted) {
      submit(hearing);
      setSubmitted(true);
    }
  }, [hearing, submit, submitted]);

  const messages = object?.messages ?? [];

  // メッセージが増えたら表示数を更新
  useEffect(() => {
    if (messages.length > displayedCount) {
      const timer = setTimeout(() => {
        setDisplayedCount(messages.length);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [messages.length, displayedCount]);

  // 会議完了 → ポカポカ演出へ
  useEffect(() => {
    if (
      !isLoading &&
      object?.messages &&
      object.messages.length > 0 &&
      phase === "meeting"
    ) {
      const timer = setTimeout(() => {
        setPhase("pokapoka");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, object?.messages, phase]);

  // 自動スクロール
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedCount, isLoading]);

  if (phase === "pokapoka") {
    return <PokapokaBattle onComplete={() => setPhase("conclusion")} />;
  }

  if (phase === "conclusion" && object) {
    return (
      <Conclusion
        conclusion={object.conclusion ?? ""}
        strategies={(object.strategies ?? []).filter(
          (s): s is string => s !== undefined
        )}
        finalWord={object.finalWord ?? ""}
        onReset={onReset}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 max-w-md mx-auto w-full">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-4">
        {messages.slice(0, displayedCount).map((msg, i) => {
          if (!msg?.cat || !msg?.text) return null;
          const isLeft = i % 2 === 0;
          return (
            <div
              key={i}
              className={`flex animate-fade-in ${isLeft ? "justify-start" : "justify-end"}`}
            >
              {isLeft && (
                <CatIcon
                  name={msg.cat as CatName}
                  size={40}
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
                  <p className="text-xs font-bold text-amber-600 mb-1">
                    {msg.cat}
                  </p>
                  <p className="text-sm">{msg.text}</p>
                </CardContent>
              </Card>
              {!isLeft && (
                <CatIcon
                  name={msg.cat as CatName}
                  size={40}
                  className="ml-1 shrink-0 self-center"
                />
              )}
            </div>
          );
        })}

        {/* タイピングインジケーター */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
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
