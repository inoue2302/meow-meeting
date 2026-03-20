"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { themes } from "@/lib/data/themes";
import { HearingResult } from "@/lib/types";

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
  const [messages, setMessages] = useState<Message[]>([
    { speaker: "トラ", text: "どうしたにゃ？何について相談するにゃ？" },
  ]);
  const [transitioning, setTransitioning] = useState(false);

  const selectedTheme = themes.find((t) => t.id === selectedThemeId);
  const currentQuestionIndex = answers.length;
  const isThemeSelected = selectedThemeId !== null;

  const currentOptions = !isThemeSelected
    ? themes.map((t) => t.label)
    : selectedTheme && currentQuestionIndex < selectedTheme.questions.length
      ? selectedTheme.questions[currentQuestionIndex].options
      : [];

  const handleSelect = (option: string) => {
    if (transitioning) return;

    // ユーザーの選択を追加
    const newMessages: Message[] = [
      ...messages,
      { speaker: "user" as const, text: option },
    ];

    if (!isThemeSelected) {
      // テーマ選択
      const theme = themes.find((t) => t.label === option);
      if (!theme) return;
      setSelectedThemeId(theme.id);
      setMessages([
        ...newMessages,
        {
          speaker: "トラ",
          text: `「${option}」にゃね。もう少し聞かせてにゃ。`,
        },
        { speaker: "トラ", text: theme.questions[0].question },
      ]);
    } else if (selectedTheme) {
      const newAnswers = [...answers, option];
      setAnswers(newAnswers);

      if (newAnswers.length < selectedTheme.questions.length) {
        // 次の質問
        setMessages([
          ...newMessages,
          {
            speaker: "トラ",
            text: selectedTheme.questions[newAnswers.length].question,
          },
        ]);
      } else {
        // 全質問完了 → 会議へ
        setMessages([
          ...newMessages,
          {
            speaker: "トラ",
            text: "なるほどにゃ...みんな集めるにゃ！",
          },
        ]);
        setTransitioning(true);
        setTimeout(() => {
          onComplete({ themeId: selectedThemeId!, answers: newAnswers });
        }, 1500);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 max-w-md mx-auto w-full">
      {/* 会話履歴 */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.speaker === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.speaker === "トラ" && (
              <div className="text-2xl mr-2 shrink-0 self-end">🐯</div>
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
      </div>

      {/* 選択肢 */}
      {!transitioning && currentOptions.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-amber-200">
          {currentOptions.map((option) => (
            <Button
              key={option}
              variant="outline"
              onClick={() => handleSelect(option)}
              className="w-full text-left justify-start py-3 h-auto text-sm border-amber-300 hover:bg-amber-100 cursor-pointer whitespace-normal"
            >
              {option}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
