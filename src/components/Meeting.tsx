"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Card, CardContent } from "@/components/ui/card";
import { CatIcon } from "@/components/CatIcon";
import { meetingSchema, MeetingResult } from "@/lib/schema";
import { HearingResult, CatName } from "@/lib/types";
import { PokapokaBattle } from "@/components/PokapokaBattle";
import { Conclusion } from "@/components/Conclusion";

interface MeetingProps {
  hearing: HearingResult;
  onReset: () => void;
}

interface ConfirmedMessage {
  cat: string;
  text: string;
}

export function Meeting({ hearing, onReset }: MeetingProps) {
  const { object, submit, isLoading } = useObject({
    api: "/api/meeting",
    schema: meetingSchema,
  });

  const [phase, setPhase] = useState<"meeting" | "pokapoka" | "conclusion">(
    "meeting"
  );
  const [submitted, setSubmitted] = useState(false);
  const [confirmedMessages, setConfirmedMessages] = useState<
    ConfirmedMessage[]
  >([]);
  const [finalResult, setFinalResult] = useState<MeetingResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMessagesLenRef = useRef(0);

  // 初回マウント時にsubmit
  useEffect(() => {
    if (!submitted) {
      submit(hearing);
      setSubmitted(true);
    }
  }, [hearing, submit, submitted]);

  const messages = object?.messages ?? [];

  // メッセージが確定したら追加（次のメッセージが来た = 前のメッセージは完成）
  useEffect(() => {
    // 新しいメッセージが生えた → 前のメッセージは完成
    if (messages.length > prevMessagesLenRef.current) {
      // 前のメッセージ群（最後以外）で未確定のものを確定
      for (let i = confirmedMessages.length; i < messages.length - 1; i++) {
        const msg = messages[i];
        if (msg?.cat && msg?.text) {
          setConfirmedMessages((prev) => [
            ...prev,
            { cat: msg.cat!, text: msg.text! },
          ]);
        }
      }
      prevMessagesLenRef.current = messages.length;
    }

    // ストリーミング完了 → 最後のメッセージも確定
    if (!isLoading && messages.length > 0) {
      const remaining: ConfirmedMessage[] = [];
      for (let i = confirmedMessages.length; i < messages.length; i++) {
        const msg = messages[i];
        if (msg?.cat && msg?.text) {
          remaining.push({ cat: msg.cat, text: msg.text });
        }
      }
      if (remaining.length > 0) {
        setConfirmedMessages((prev) => [...prev, ...remaining]);
      }
    }
  }, [messages, messages.length, isLoading, confirmedMessages.length]);

  // ストリーミング中かどうか（最後のメッセージがまだ生成中）
  const isStreamingMessage =
    isLoading && messages.length > confirmedMessages.length;

  // 会議完了 → 結果を保存してポカポカ演出へ
  useEffect(() => {
    if (
      !isLoading &&
      object?.messages &&
      object.messages.length > 0 &&
      phase === "meeting"
    ) {
      const completeMessages = (object.messages ?? [])
        .filter((m) => !!m?.cat && !!m?.text)
        .map((m) => ({ cat: m!.cat!, text: m!.text! }));
      const completeStrategies = (object.strategies ?? []).filter(
        (s): s is string => s !== undefined
      );
      setFinalResult({
        messages: completeMessages,
        conclusion: object.conclusion ?? "",
        strategies: completeStrategies,
        finalWord: object.finalWord ?? "",
      } as MeetingResult);
      const timer = setTimeout(() => {
        setPhase("pokapoka");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, object, phase]);

  // 自動スクロール
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [confirmedMessages.length, isStreamingMessage, scrollToBottom]);

  if (phase === "pokapoka") {
    return <PokapokaBattle onComplete={() => setPhase("conclusion")} />;
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
        {/* 確定済みメッセージのみ表示（ストリーミング中のテキストは非表示） */}
        {confirmedMessages.map((msg, i) => (
          <MessageBubble key={`msg-${i}`} msg={msg} index={i} />
        ))}

        {/* ストリーミング中はタイピングインジケーターのみ */}
        {(isStreamingMessage || (isLoading && messages.length === 0)) && (
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

function MessageBubble({
  msg,
  index,
}: {
  msg: { cat: string; text: string };
  index: number;
}) {
  const isLeft = index % 2 === 0;
  return (
    <div
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
          <p className="text-xs font-bold text-amber-600 mb-1">{msg.cat}</p>
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
}
