"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CatIcon } from "@/components/CatIcon";
import { meetingSchema, MeetingResult } from "@/lib/schema";
import { HearingResult, CatName, isCatName } from "@/lib/types";
import { PokapokaBattle } from "@/components/PokapokaBattle";
import { Conclusion } from "@/components/Conclusion";

const EMPTY_MESSAGES: never[] = [];

interface MeetingProps {
  hearing: HearingResult;
  onReset: () => void;
}

interface ConfirmedMessage {
  cat: CatName;
  text: string;
}

type MeetingPhase = "streaming" | "done" | "pokapoka" | "conclusion";

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

  const messages = object?.messages ?? EMPTY_MESSAGES;
  const messagesLen = messages.length;

  // 完成したメッセージを確定（次のメッセージが来た = 前のは完成）
  useEffect(() => {
    const completedCount = isLoading
      ? Math.max(0, messagesLen - 1)
      : messagesLen;

    if (completedCount > confirmedCountRef.current) {
      const newConfirmed: ConfirmedMessage[] = messages
        .slice(confirmedCountRef.current, completedCount)
        .flatMap((msg) => {
          if (msg?.cat && msg?.text && isCatName(msg.cat)) {
            return [{ cat: msg.cat, text: msg.text }];
          }
          return [];
        });

      if (newConfirmed.length > 0) {
        setConfirmedMessages((prev) => [...prev, ...newConfirmed]);
        confirmedCountRef.current += newConfirmed.length;
      }
    }
  }, [messagesLen, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // ストリーミング中の最後のメッセージ
  const streamingMsg =
    isLoading && messagesLen > confirmedCountRef.current
      ? messages[messagesLen - 1]
      : null;

  // ストリーミング完了 → done へ
  useEffect(() => {
    if (!isLoading && phase === "streaming" && submittedRef.current) {
      const strategies = (object?.strategies ?? []).filter(
        (s): s is string => s !== undefined
      );
      const result: MeetingResult = {
        messages: confirmedMessages,
        conclusion: object?.conclusion ?? "",
        strategies: [
          strategies[0] ?? "",
          strategies[1] ?? "",
          strategies[2] ?? "",
        ],
        finalWord: object?.finalWord ?? "",
      };
      setFinalResult(result);
      setPhase("done");
    }
  }, [isLoading, phase, confirmedMessages, object]);

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

  // ストリーミング中のスクロール追従（instant でガタつき防止）
  useEffect(() => {
    if (streamingMsg?.text && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }); // 毎レンダーで実行（RAF相当）

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
          <ChatBubble key={`msg-${i}`} msg={msg} index={i} />
        ))}

        {/* ストリーミング中のメッセージ（リアルタイム表示） */}
        {streamingMsg?.cat && streamingMsg?.text && isCatName(streamingMsg.cat) && (
          <ChatBubble
            msg={{ cat: streamingMsg.cat, text: streamingMsg.text }}
            index={confirmedMessages.length}
            isStreaming
          />
        )}

        {/* タイピングインジケーター（まだテキストが来ていない時） */}
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

      {/* 会議完了 → 結果を見るボタン */}
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
