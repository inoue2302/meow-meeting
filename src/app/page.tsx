"use client";

import { useState } from "react";
import { TopScreen } from "@/components/TopScreen";
import { Hearing } from "@/components/Hearing";
import { Meeting } from "@/components/Meeting";
import { RateLimitedScreen } from "@/components/RateLimitedScreen";
import { HearingResult } from "@/lib/types";
import { checkLimit } from "@/app/actions";

type Phase = "top" | "hearing" | "meeting" | "rate-limited";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("top");
  const [hearingResult, setHearingResult] = useState<HearingResult | null>(null);

  const handleStart = async () => {
    try {
      const { allowed } = await checkLimit();
      if (!allowed) {
        setPhase("rate-limited");
        return;
      }
    } catch {
      // チェック失敗時はそのまま進める
    }
    setPhase("hearing");
  };

  const handleHearingComplete = (result: HearingResult) => {
    setHearingResult(result);
    setPhase("meeting");
  };

  const handleReset = () => {
    setHearingResult(null);
    setPhase("top");
  };

  if (phase === "top") {
    return <TopScreen onStart={handleStart} />;
  }

  if (phase === "rate-limited") {
    return <RateLimitedScreen onReset={handleReset} />;
  }

  if (phase === "hearing") {
    return <Hearing onComplete={handleHearingComplete} />;
  }

  if (phase === "meeting" && hearingResult) {
    return <Meeting hearing={hearingResult} onReset={handleReset} />;
  }

  return null;
}
