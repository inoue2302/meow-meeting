"use client";

import { useState } from "react";
import Image from "next/image";
import { TopScreen } from "@/components/TopScreen";
import { Hearing } from "@/components/Hearing";
import { Meeting } from "@/components/Meeting";
import { Button } from "@/components/ui/button";
import { HearingResult } from "@/lib/types";

type Phase = "top" | "hearing" | "meeting" | "rate-limited";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("top");
  const [hearingResult, setHearingResult] = useState<HearingResult | null>(null);

  const handleStart = async () => {
    try {
      const res = await fetch("/api/check-limit");
      const { allowed } = await res.json();
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 max-w-md mx-auto text-center">
        <Image
          src="/cats/sleeping.png"
          alt="お休み中の猫たち"
          width={280}
          height={280}
        />
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-amber-800">
            猫たちはお休み中にゃ...
          </h2>
          <p className="text-sm text-amber-600">
            今日はたくさん会議したから、みんな疲れちゃったにゃ。
            <br />
            明日また来てほしいにゃ。
          </p>
        </div>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-amber-300 hover:bg-amber-100 cursor-pointer"
        >
          トップに戻るにゃ
        </Button>
      </div>
    );
  }

  if (phase === "hearing") {
    return <Hearing onComplete={handleHearingComplete} />;
  }

  if (phase === "meeting" && hearingResult) {
    return <Meeting hearing={hearingResult} onReset={handleReset} />;
  }

  return null;
}
