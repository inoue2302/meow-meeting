"use client";

import { useState } from "react";
import { TopScreen } from "@/components/TopScreen";
import { Hearing } from "@/components/Hearing";
import { Meeting } from "@/components/Meeting";
import { HearingResult } from "@/lib/types";

type Phase = "top" | "hearing" | "meeting";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("top");
  const [hearingResult, setHearingResult] = useState<HearingResult | null>(null);

  const handleStart = () => {
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

  if (phase === "hearing") {
    return <Hearing onComplete={handleHearingComplete} />;
  }

  if (phase === "meeting" && hearingResult) {
    return <Meeting hearing={hearingResult} onReset={handleReset} />;
  }

  return null;
}
