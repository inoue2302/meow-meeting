"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Card, CardContent } from "@/components/ui/card";
import { CatIcon } from "@/components/CatIcon";
import { meetingSchema, MeetingResult } from "@/lib/schema";
import { HearingResult, CatName } from "@/lib/types";
import { PokapokaBattle } from "@/components/PokapokaBattle";
import { Conclusion } from "@/components/Conclusion";

const MESSAGE_DISPLAY_DELAY_MS = 1200;

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
  const [readyQueue, setReadyQueue] = useState<ConfirmedMessage[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<ConfirmedMessage[]>([]);
  const [finalResult, setFinalResult] = useState<MeetingResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const readyCountRef = useRef(0);
  const displayTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 初回マウント時にsubmit
  useEffect(() => {
    if (!submitted) {
      submit(hearing);
      setSubmitted(true);
    }
  }, [hearing, submit, submitted]);

  const messages = object?.messages ?? [];
  const messagesLen = messages.length;

  // 完成したメッセージをreadyQueueに追加
  // 「次のメッセージが来た = 前のメッセージは完成」のロジック
  useEffect(() => {
    // messages配列で、最後の1件以外は完成とみなす
    const completedCount = isLoading ? Math.max(0, messagesLen - 1) : messagesLen;

    if (completedCount > readyCountRef.current) {
      const newMessages: ConfirmedMessage[] = [];
      for (let i = readyCountRef.current; i < completedCount; i++) {
        const msg = messages[i];
        if (msg?.cat && msg?.text) {
          newMessages.push({ cat: msg.cat, text: msg.text });
        }
      }
      if (newMessages.length > 0) {
        setReadyQueue((prev) => [...prev, ...newMessages]);
      }
      readyCountRef.current = completedCount;
    }
  }, [messagesLen, isLoading, messages]);

  // readyQueueから1つずつ遅延表示
  useEffect(() => {
    if (displayedMessages.length < readyQueue.length) {
      displayTimerRef.current = setTimeout(() => {
        setDisplayedMessages((prev) => [...prev, readyQueue[prev.length]]);
      }, MESSAGE_DISPLAY_DELAY_MS);
      return () => clearTimeout(displayTimerRef.current);
    }
  }, [readyQueue.length, displayedMessages.length, readyQueue]);

  // 表示待ちがあるか、まだストリーミング中
  const showTypingIndicator =
    displayedMessages.length < readyQueue.length ||
    (isLoading && messagesLen <= readyQueue.length + 1);

  // 全メッセージ表示完了 + ストリーミング完了 → ポカポカ演出へ
  useEffect(() => {
    if (
      !isLoading &&
      object?.messages &&
      object.messages.length > 0 &&
      readyQueue.length >= object.messages.length &&
      displayedMessages.length >= readyQueue.length &&
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
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, object, phase, displayedMessages.length, readyQueue.length]);

  // 自動スクロール
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages.length, showTypingIndicator, scrollToBottom]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (displayTimerRef.current) clearTimeout(displayTimerRef.current);
    };
  }, []);

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
        {displayedMessages.map((msg, i) => (
          <MessageBubble key={`msg-${i}`} msg={msg} index={i} />
        ))}

        {showTypingIndicator && (
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
