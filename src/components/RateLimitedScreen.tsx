"use client";

import Image from "next/image";

interface RateLimitedScreenProps {
  onReset: () => void;
}

export function RateLimitedScreen({ onReset }: RateLimitedScreenProps) {
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
      <button
        onClick={onReset}
        className="border border-amber-300 hover:bg-amber-100 active:bg-amber-200 px-6 py-3 rounded-xl cursor-pointer font-medium text-amber-800"
      >
        トップに戻るにゃ
      </button>
    </div>
  );
}
