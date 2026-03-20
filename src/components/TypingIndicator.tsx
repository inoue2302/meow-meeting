"use client";

import { Card, CardContent } from "@/components/ui/card";

export function TypingIndicator() {
  return (
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
  );
}
