"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CatIcon } from "@/components/CatIcon";

interface TopScreenProps {
  onStart: () => void;
}

export function TopScreen({ onStart }: TopScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <Card className="max-w-md w-full text-center shadow-lg border-amber-200 bg-white/80">
        <CardContent className="pt-8 pb-6 px-6 space-y-6">
          {/* 4匹集合 */}
          <div className="relative h-32 mx-auto w-64">
            {/* 後列 */}
            <div className="absolute left-6 top-0">
              <CatIcon name="スミ" size={72} />
            </div>
            <div className="absolute right-6 top-0">
              <CatIcon name="カゼ" size={72} />
            </div>
            {/* 前列 */}
            <div className="absolute left-16 top-10 z-10">
              <CatIcon name="モチ" size={80} />
            </div>
            <div className="absolute right-16 top-10 z-10">
              <CatIcon name="トラ" size={80} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-amber-900">
              にゃんず進路会議
            </h1>
            <p className="text-sm text-amber-700">
              AI時代のキャリア作戦会議
            </p>
          </div>

          <p className="text-base text-amber-800 leading-relaxed">
            AIの話、人間に聞いても
            <br />
            不安になるだけ。
            <br />
            <span className="font-bold">猫に聞こう。</span>
          </p>

          <Button
            onClick={onStart}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 rounded-xl cursor-pointer"
          >
            相談するにゃ 🐾
          </Button>

          <p className="text-xs text-muted-foreground leading-relaxed">
            ※ エンタメ目的のアプリです。実際のキャリアアドバイスではありません。
            <br />
            重要な判断は専門家にご相談ください。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
