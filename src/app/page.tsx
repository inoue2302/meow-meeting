"use client";

import { useState } from "react";
import { TopScreen } from "@/components/TopScreen";
import { Hearing } from "@/components/Hearing";
import { HearingResult } from "@/lib/types";

type Phase = "top" | "hearing" | "meeting";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("top");
  const [, setHearingResult] = useState<HearingResult | null>(null);

  const handleStart = () => {
    setPhase("hearing");
  };

  const handleHearingComplete = (result: HearingResult) => {
    setHearingResult(result);
    // TODO: #4 API実装後に会議フェーズへ遷移
    setPhase("meeting");
  };

  if (phase === "top") {
    return <TopScreen onStart={handleStart} />;
  }

  if (phase === "hearing") {
    return <Hearing onComplete={handleHearingComplete} />;
  }

  // TODO: #5 会議画面
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <p className="text-amber-800 text-lg">
        会議の準備中にゃ...（#4, #5 で実装予定）
      </p>
    </div>
  );
}
