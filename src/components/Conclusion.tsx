"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CatIcon } from "@/components/CatIcon";

interface ConclusionProps {
  conclusion: string;
  strategies: string[];
  finalWord: string;
  onReset: () => void;
}

export function Conclusion({
  conclusion,
  strategies,
  finalWord,
  onReset,
}: ConclusionProps) {
  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 max-w-md mx-auto w-full space-y-6">
      {/* トラのまとめ */}
      <Card className="w-full shadow-lg border-green-200 bg-green-50">
        <CardContent className="px-6 py-6 space-y-4">
          <div className="flex items-center gap-2">
            <CatIcon name="トラ" size={48} />
            <p className="text-sm font-bold text-green-700">トラのまとめ</p>
          </div>
          <p className="text-base text-green-900 leading-relaxed">
            {conclusion}
          </p>
        </CardContent>
      </Card>

      {/* 明日からの作戦 */}
      <Card className="w-full shadow-md border-amber-200 bg-white">
        <CardContent className="px-6 py-6 space-y-4">
          <h3 className="text-lg font-bold text-amber-800">
            明日からの作戦
          </h3>
          <ol className="space-y-3">
            {strategies.map((strategy, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-amber-500 font-bold text-lg shrink-0">
                  {i + 1}.
                </span>
                <p className="text-sm text-amber-900 leading-relaxed">
                  {strategy}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* 最後の一言 */}
      <Card className="w-full border-amber-300 bg-amber-50">
        <CardContent className="px-6 py-5">
          <p className="text-center text-sm text-amber-800 leading-relaxed italic">
            {finalWord}
          </p>
        </CardContent>
      </Card>

      {/* もう一度 */}
      <Button
        onClick={onReset}
        size="lg"
        className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 rounded-xl cursor-pointer"
      >
        もう一度相談するにゃ 🐾
      </Button>
    </div>
  );
}
