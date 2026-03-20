"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CatIcon } from "@/components/CatIcon";
import { TypingIndicator } from "@/components/TypingIndicator";
import { themes } from "@/lib/data/themes";
import { HearingResult } from "@/lib/types";

const TYPING_DELAY_MIN_MS = 800;
const TYPING_DELAY_RANGE_MS = 600;
const TRANSITION_DELAY_MS = 2500;

interface HearingProps {
  onComplete: (result: HearingResult) => void;
}

interface Message {
  speaker: "トラ" | "user";
  text: string;
}

export function Hearing({ onComplete }: HearingProps) {
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  // 確定済みメッセージ（表示中のもの）
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  // 表示待ちキュー（トラのメッセージを順番に出す）
  const [pendingMessages, setPendingMessages] = useState<Message[]>([
    { speaker: "トラ", text: "どうしたにゃ？何について相談するにゃ？" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompletingHearing, setIsCompletingHearing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);
  const currentQuestionIndex = answers.length;
  const isThemeSelected = selectedThemeId !== null;

  const currentOptions = !isThemeSelected
    ? themes.map((t) => t.label)
    : selectedTheme && currentQuestionIndex < selectedTheme.questions.length
      ? selectedTheme.questions[currentQuestionIndex].options
      : [];

  const bottomRef = useRef<HTMLDivElement>(null);

  // 自動スクロール
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // pendingMessagesを1つずつ表示する
  useEffect(() => {
    if (pendingMessages.length === 0) return;

    setShowOptions(false);
    setIsTyping(true);

    const delay =
      pendingMessages[0].speaker === "トラ"
        ? TYPING_DELAY_MIN_MS + Math.random() * TYPING_DELAY_RANGE_MS
        : 0;

    const timer = setTimeout(() => {
      setIsTyping(false);
      setDisplayedMessages((prev) => [...prev, pendingMessages[0]]);
      setPendingMessages((prev) => prev.slice(1));
    }, delay);

    return () => clearTimeout(timer);
  }, [pendingMessages]);

  // 全部表示し終わったら選択肢を出す
  useEffect(() => {
    if (pendingMessages.length === 0 && !isTyping && displayedMessages.length > 0) {
      const timer = setTimeout(() => {
        setShowOptions(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pendingMessages.length, isTyping, displayedMessages.length]);

  // メッセージ追加時にスクロール
  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages, isTyping, scrollToBottom]);

  // 遷移タイマーのクリーンアップ
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const handleThemeSelection = (option: string) => {
    const theme = themes.find((t) => t.label === option);
    if (!theme) return;
    setSelectedThemeId(theme.id);
    setPendingMessages([
      { speaker: "トラ", text: `「${option}」にゃね。もう少し聞かせてにゃ。` },
      { speaker: "トラ", text: theme.questions[0].question },
    ]);
  };

  const handleAnswerSelection = (option: string) => {
    if (!selectedTheme) return;
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (newAnswers.length < selectedTheme.questions.length) {
      setPendingMessages([
        { speaker: "トラ", text: selectedTheme.questions[newAnswers.length].question },
      ]);
      return;
    }

    setPendingMessages([
      { speaker: "トラ", text: "なるほどにゃ...みんな集めるにゃ！" },
    ]);
    setIsCompletingHearing(true);
    transitionTimerRef.current = setTimeout(() => {
      onComplete({ themeId: selectedTheme.id, answers: newAnswers });
    }, TRANSITION_DELAY_MS);
  };

  const handleSelect = (option: string) => {
    if (isCompletingHearing || pendingMessages.length > 0 || isTyping) return;

    setShowOptions(false);
    setDisplayedMessages((prev) => [...prev, { speaker: "user", text: option }]);

    if (!isThemeSelected) {
      handleThemeSelection(option);
    } else {
      handleAnswerSelection(option);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 max-w-md mx-auto w-full">
      {/* 会話履歴 */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-4">
        {displayedMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex animate-fade-in ${msg.speaker === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.speaker === "トラ" && (
              <CatIcon name="トラ" size={40} className="mr-1 shrink-0 self-center" />
            )}
            <Card
              className={`max-w-[80%] ${
                msg.speaker === "user"
                  ? "bg-green-100 border-green-200"
                  : "bg-white border-amber-200"
              }`}
            >
              <CardContent className="px-4 py-3">
                <p className="text-sm">{msg.text}</p>
              </CardContent>
            </Card>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* 選択肢 */}
      {showOptions && !isCompletingHearing && currentOptions.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-amber-200 animate-fade-in">
          {currentOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="w-full text-left py-3 px-4 text-sm border border-amber-300 hover:bg-amber-100 active:bg-amber-200 rounded-lg cursor-pointer whitespace-normal bg-white"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
