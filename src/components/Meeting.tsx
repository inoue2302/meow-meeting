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
  // LLMから完成したメッセージのキュー
  const [readyMessages, setReadyMessages] = useState<ConfirmedMessage[]>([]);
  // 画面に表示済みのメッセージ
  const [displayedMessages, setDisplayedMessages] = useState<
    ConfirmedMessage[]
  >([]);
  const [finalResult, setFinalResult] = useState<MeetingResult | null>(null);
  const [isShowingTyping, setIsShowingTyping] = useState(false);
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

  // LLMから完成したメッセージをreadyキューに追加
  useEffect(() => {
    if (messages.length > prevMessagesLenRef.current) {
      for (
        let i = Math.max(prevMessagesLenRef.current, 0);
        i < messages.length - 1;
        i++
      ) {
        const msg = messages[i];
        if (msg?.cat && msg?.text) {
          setReadyMessages((prev) => {
            if (prev.length <= i) {
              return [...prev, { cat: msg.cat!, text: msg.text! }];
            }
            return prev;
          });
        }
      }
      prevMessagesLenRef.current = messages.length;
    }

    // ストリーミング完了 → 最後のメッセージもreadyに
    if (!isLoading && messages.length > 0) {
      const allReady: ConfirmedMessage[] = [];
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (msg?.cat && msg?.text) {
          allReady.push({ cat: msg.cat, text: msg.text });
        }
      }
      setReadyMessages(allReady);
    }
  }, [messages, messages.length, isLoading]);

  // readyキューから1つずつ遅延表示
  useEffect(() => {
    if (displayedMessages.length < readyMessages.length && !isShowingTyping) {
      setIsShowingTyping(true);
      const timer = setTimeout(() => {
        setDisplayedMessages((prev) => [
          ...prev,
          readyMessages[prev.length],
        ]);
        setIsShowingTyping(false);
      }, MESSAGE_DISPLAY_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [readyMessages.length, displayedMessages.length, isShowingTyping, readyMessages]);

  // ストリーミング中 or 表示待ちがある
  const showTypingIndicator =
    isShowingTyping ||
    (isLoading && messages.length <= displayedMessages.length);

  // 全メッセージ表示完了かつストリーミング完了 → ポカポカ演出へ
  useEffect(() => {
    if (
      !isLoading &&
      object?.messages &&
      object.messages.length > 0 &&
      displayedMessages.length >= object.messages.length &&
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
  }, [isLoading, object, phase, displayedMessages.length]);

  // 自動スクロール
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages.length, showTypingIndicator, scrollToBottom]);

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
