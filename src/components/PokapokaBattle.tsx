"use client";

import { useEffect, useState } from "react";
import { CatIcon } from "@/components/CatIcon";

interface PokapokaBattleProps {
  onComplete: () => void;
}

const battleCries = [
  { text: "にゃー！", x: 15, y: 10 },
  { text: "にゃにゃ！", x: 65, y: 5 },
  { text: "ふにゃっ！", x: 10, y: 55 },
  { text: "にゃっ！", x: 70, y: 50 },
  { text: "むにゃ！", x: 40, y: 25 },
  { text: "にゃあ！", x: 45, y: 65 },
];

const impactMarks = [
  { x: 35, y: 30 },
  { x: 60, y: 40 },
  { x: 45, y: 55 },
  { x: 30, y: 50 },
];

export function PokapokaBattle({ onComplete }: PokapokaBattleProps) {
  const [showSettle, setShowSettle] = useState(false);
  const [showSmoke, setShowSmoke] = useState(true);

  useEffect(() => {
    const smokeTimer = setTimeout(() => setShowSmoke(false), 2500);
    const settleTimer = setTimeout(() => setShowSettle(true), 2800);
    const completeTimer = setTimeout(() => onComplete(), 4500);
    return () => {
      clearTimeout(smokeTimer);
      clearTimeout(settleTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-amber-50 overflow-hidden">
      {/* タイトル */}
      {!showSettle && (
        <p className="text-lg font-bold text-amber-700 mb-4 animate-bounce">
          猫たちが議論をまとめ中...
        </p>
      )}

      <div className="relative w-80 h-80">
        {/* 煙エフェクト - 複数の円で表現 */}
        {showSmoke && (
          <>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-amber-100 rounded-full opacity-50 animate-smoke-1" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-200 rounded-full opacity-40 animate-smoke-2" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-100 rounded-full opacity-50 animate-smoke-3" />
          </>
        )}

        {/* 衝撃マーク ★ */}
        {!showSettle &&
          impactMarks.map((mark, i) => (
            <div
              key={`impact-${i}`}
              className="absolute text-2xl animate-impact"
              style={{
                left: `${mark.x}%`,
                top: `${mark.y}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              💥
            </div>
          ))}

        {/* 4匹の猫 */}
        <div
          className={`absolute left-2 top-6 z-10 ${!showSettle ? "animate-poka-tl" : "animate-settle-tl"}`}
        >
          <CatIcon name="モチ" size={88} />
        </div>
        <div
          className={`absolute right-2 top-6 z-10 ${!showSettle ? "animate-poka-tr" : "animate-settle-tr"}`}
        >
          <CatIcon name="カゼ" size={88} />
        </div>
        <div
          className={`absolute left-8 bottom-6 z-10 ${!showSettle ? "animate-poka-bl" : "animate-settle-bl"}`}
        >
          <CatIcon name="スミ" size={88} />
        </div>
        <div
          className={`absolute right-8 bottom-6 z-10 ${!showSettle ? "animate-poka-br" : "animate-settle-br"}`}
        >
          <CatIcon name="トラ" size={88} />
        </div>

        {/* にゃー！吹き出し */}
        {!showSettle &&
          battleCries.map((cry, i) => (
            <div
              key={`cry-${i}`}
              className="absolute text-sm font-bold text-amber-700 animate-pop z-20 pointer-events-none"
              style={{
                left: `${cry.x}%`,
                top: `${cry.y}%`,
                animationDelay: `${i * 0.35}s`,
              }}
            >
              <span className="bg-white/80 rounded-full px-2 py-0.5 shadow-sm">
                {cry.text}
              </span>
            </div>
          ))}
      </div>

      {/* トラ「落ち着くにゃ」 */}
      {showSettle && (
        <div className="mt-6 animate-fade-in text-center space-y-3">
          <div className="bg-white rounded-2xl px-8 py-4 shadow-lg border-2 border-green-300 inline-block">
            <p className="text-lg text-green-800 font-bold">
              はいはい、落ち着くにゃ 🐾
            </p>
          </div>
          <p className="text-sm text-amber-600">まとめに入るにゃ...</p>
        </div>
      )}
    </div>
  );
}
