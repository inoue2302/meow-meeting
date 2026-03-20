"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CatIcon } from "@/components/CatIcon";
import { CatName } from "@/lib/types";

interface ChatBubbleProps {
  cat: CatName;
  text: string;
  index: number;
  isStreaming?: boolean;
}

export function ChatBubble({ cat, text, index, isStreaming }: ChatBubbleProps) {
  const isLeft = index % 2 === 0;
  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"}`}>
      {isLeft && (
        <CatIcon
          name={cat}
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
          <p className="text-xs font-bold text-amber-600 mb-1">{cat}</p>
          <p className={`text-sm ${isStreaming ? "min-h-5" : ""}`}>{text}</p>
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
