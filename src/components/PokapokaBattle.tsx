"use client";

import { useEffect, useState } from "react";
import { CatIcon } from "@/components/CatIcon";

interface PokapokaBattleProps {
  onComplete: () => void;
}

const exclamations = ["にゃー！", "にゃにゃ！", "ふにゃ！", "にゃっ！"];

export function PokapokaBattle({ onComplete }: PokapokaBattleProps) {
  const [showSettle, setShowSettle] = useState(false);

  useEffect(() => {
    const settleTimer = setTimeout(() => setShowSettle(true), 2000);
    const completeTimer = setTimeout(() => onComplete(), 3500);
    return () => {
      clearTimeout(settleTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-amber-50">
      <div className="relative w-72 h-72">
        {/* 煙エフェクト */}
        {!showSettle && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-amber-100 rounded-full opacity-60 animate-pulse" />
          </div>
        )}

        {/* 4匹の猫 */}
        <div
          className={`absolute left-4 top-8 ${!showSettle ? "animate-poka-left" : ""}`}
        >
          <CatIcon name="モチ" size={80} />
        </div>
        <div
          className={`absolute right-4 top-8 ${!showSettle ? "animate-poka-right" : ""}`}
        >
          <CatIcon name="カゼ" size={80} />
        </div>
        <div
          className={`absolute left-12 bottom-8 ${!showSettle ? "animate-poka-left" : ""}`}
        >
          <CatIcon name="スミ" size={80} />
        </div>
        <div
          className={`absolute right-12 bottom-8 ${!showSettle ? "animate-poka-right" : ""}`}
        >
          <CatIcon name="トラ" size={80} />
        </div>

        {/* にゃー！吹き出し */}
        {!showSettle &&
          exclamations.map((text, i) => (
            <div
              key={i}
              className="absolute text-sm font-bold text-amber-700 animate-pop"
              style={{
                left: `${20 + (i % 2) * 40}%`,
                top: `${10 + Math.floor(i / 2) * 50}%`,
                animationDelay: `${i * 0.4}s`,
              }}
            >
              {text}
            </div>
          ))}
      </div>

      {/* トラ「落ち着くにゃ」 */}
      {showSettle && (
        <div className="mt-4 animate-fade-in text-center">
          <div className="bg-white rounded-2xl px-6 py-3 shadow-md border border-amber-200 inline-block">
            <p className="text-base text-amber-800 font-bold">
              はいはい、落ち着くにゃ
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
