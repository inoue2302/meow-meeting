"use client";

import { CatName } from "@/lib/types";

interface CatIconProps {
  name: CatName;
  size?: number;
  className?: string;
}

// モチ: ピンク系・まんまる・やさしい
function Mochi({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* 背景円 */}
      <circle cx="60" cy="60" r="56" fill="#FFF0F5" />
      {/* 耳 */}
      <path d="M28 42 Q22 14 40 28" fill="#FBCFE8" stroke="#8B5E3C" strokeWidth="2" />
      <path d="M92 42 Q98 14 80 28" fill="#FBCFE8" stroke="#8B5E3C" strokeWidth="2" />
      {/* 耳の中 */}
      <path d="M30 38 Q26 20 39 30" fill="#F9A8D4" />
      <path d="M90 38 Q94 20 81 30" fill="#F9A8D4" />
      {/* 顔 */}
      <ellipse cx="60" cy="62" rx="34" ry="30" fill="#FBCFE8" stroke="#8B5E3C" strokeWidth="2.5" />
      {/* 白い部分（口周り） */}
      <ellipse cx="60" cy="72" rx="20" ry="15" fill="#FFF5F7" />
      {/* 縞模様 */}
      <path d="M52 36 Q55 30 58 36" stroke="#F472B6" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M62 36 Q65 30 68 36" stroke="#F472B6" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M57 32 Q60 26 63 32" stroke="#F472B6" strokeWidth="2" fill="none" opacity="0.5" />
      {/* 目 - 大きくうるうる */}
      <ellipse cx="46" cy="56" rx="7" ry="8" fill="white" stroke="#8B5E3C" strokeWidth="1.5" />
      <ellipse cx="74" cy="56" rx="7" ry="8" fill="white" stroke="#8B5E3C" strokeWidth="1.5" />
      <ellipse cx="47" cy="57" rx="5" ry="6" fill="#EC4899" />
      <ellipse cx="75" cy="57" rx="5" ry="6" fill="#EC4899" />
      <ellipse cx="47" cy="57" rx="3.5" ry="4.5" fill="#BE185D" />
      <ellipse cx="75" cy="57" rx="3.5" ry="4.5" fill="#BE185D" />
      <ellipse cx="49" cy="54.5" rx="2" ry="2.2" fill="white" />
      <ellipse cx="77" cy="54.5" rx="2" ry="2.2" fill="white" />
      <ellipse cx="46" cy="58" rx="1" ry="1" fill="white" opacity="0.7" />
      <ellipse cx="74" cy="58" rx="1" ry="1" fill="white" opacity="0.7" />
      {/* 鼻 */}
      <path d="M58 66 L60 68 L62 66 Z" fill="#EC4899" stroke="#8B5E3C" strokeWidth="0.8" />
      {/* 口 */}
      <path d="M60 68 L60 71" stroke="#8B5E3C" strokeWidth="1.2" />
      <path d="M54 72 Q60 77 66 72" stroke="#8B5E3C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* ほっぺ（チーク） */}
      <circle cx="36" cy="66" r="7" fill="#F472B6" opacity="0.25" />
      <circle cx="84" cy="66" r="7" fill="#F472B6" opacity="0.25" />
      {/* ひげ */}
      <path d="M20 60 Q33 58 40 62" stroke="#8B5E3C" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <path d="M18 67 Q33 66 40 66" stroke="#8B5E3C" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <path d="M100 60 Q87 58 80 62" stroke="#8B5E3C" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <path d="M102 67 Q87 66 80 66" stroke="#8B5E3C" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

// カゼ: オレンジ系・活発・キラキラ
function Kaze({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* 背景円 */}
      <circle cx="60" cy="60" r="56" fill="#FFF7ED" />
      {/* 耳 - ピンと */}
      <path d="M26 38 Q18 8 42 26" fill="#FED7AA" stroke="#7C4A1E" strokeWidth="2" />
      <path d="M94 38 Q102 8 78 26" fill="#FED7AA" stroke="#7C4A1E" strokeWidth="2" />
      <path d="M28 34 Q22 14 40 28" fill="#FB923C" opacity="0.5" />
      <path d="M92 34 Q98 14 80 28" fill="#FB923C" opacity="0.5" />
      {/* 顔 */}
      <ellipse cx="60" cy="62" rx="34" ry="30" fill="#FED7AA" stroke="#7C4A1E" strokeWidth="2.5" />
      {/* 白い部分 */}
      <ellipse cx="60" cy="72" rx="20" ry="15" fill="#FFF8F0" />
      {/* 縞模様 */}
      <path d="M50 36 Q54 28 58 36" stroke="#EA580C" strokeWidth="2.2" fill="none" opacity="0.5" />
      <path d="M62 36 Q66 28 70 36" stroke="#EA580C" strokeWidth="2.2" fill="none" opacity="0.5" />
      <path d="M56 32 Q60 24 64 32" stroke="#EA580C" strokeWidth="2.2" fill="none" opacity="0.5" />
      {/* 目 - 大きくキラキラ */}
      <ellipse cx="46" cy="56" rx="7.5" ry="8.5" fill="white" stroke="#7C4A1E" strokeWidth="1.5" />
      <ellipse cx="74" cy="56" rx="7.5" ry="8.5" fill="white" stroke="#7C4A1E" strokeWidth="1.5" />
      <ellipse cx="47" cy="57" rx="5.5" ry="6.5" fill="#F59E0B" />
      <ellipse cx="75" cy="57" rx="5.5" ry="6.5" fill="#F59E0B" />
      <ellipse cx="47" cy="57" rx="4" ry="5" fill="#B45309" />
      <ellipse cx="75" cy="57" rx="4" ry="5" fill="#B45309" />
      <ellipse cx="49.5" cy="54" rx="2.2" ry="2.5" fill="white" />
      <ellipse cx="77.5" cy="54" rx="2.2" ry="2.5" fill="white" />
      <ellipse cx="46" cy="58.5" rx="1.2" ry="1.2" fill="white" opacity="0.7" />
      <ellipse cx="74" cy="58.5" rx="1.2" ry="1.2" fill="white" opacity="0.7" />
      {/* キラキラ */}
      <path d="M85 40 L87 36 L89 40 L93 42 L89 44 L87 48 L85 44 L81 42 Z" fill="#FCD34D" opacity="0.6" />
      {/* 鼻 */}
      <path d="M58 66 L60 68 L62 66 Z" fill="#EA580C" stroke="#7C4A1E" strokeWidth="0.8" />
      {/* 口 - にかっ */}
      <path d="M60 68 L60 71" stroke="#7C4A1E" strokeWidth="1.2" />
      <path d="M52 71 Q56 76 60 72 Q64 76 68 71" stroke="#7C4A1E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* ほっぺ */}
      <circle cx="36" cy="66" r="7" fill="#FB923C" opacity="0.25" />
      <circle cx="84" cy="66" r="7" fill="#FB923C" opacity="0.25" />
      {/* ひげ - 元気 */}
      <path d="M18 57 Q33 56 40 61" stroke="#7C4A1E" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <path d="M17 65 Q33 65 40 65" stroke="#7C4A1E" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <path d="M102 57 Q87 56 80 61" stroke="#7C4A1E" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <path d="M103 65 Q87 65 80 65" stroke="#7C4A1E" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

// スミ: ブルー系・クール・半目
function Sumi({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* 背景円 */}
      <circle cx="60" cy="60" r="56" fill="#EFF6FF" />
      {/* 耳 */}
      <path d="M28 42 Q20 12 42 28" fill="#BFDBFE" stroke="#3B4F6B" strokeWidth="2" />
      <path d="M92 42 Q100 12 78 28" fill="#BFDBFE" stroke="#3B4F6B" strokeWidth="2" />
      <path d="M30 38 Q24 16 40 30" fill="#60A5FA" opacity="0.4" />
      <path d="M90 38 Q96 16 80 30" fill="#60A5FA" opacity="0.4" />
      {/* 顔 */}
      <ellipse cx="60" cy="62" rx="34" ry="30" fill="#BFDBFE" stroke="#3B4F6B" strokeWidth="2.5" />
      {/* 白い部分 */}
      <ellipse cx="60" cy="72" rx="20" ry="15" fill="#EFF6FF" />
      {/* 長毛のモフモフ（頬の毛） */}
      <path d="M28 55 Q22 62 28 70" stroke="#93C5FD" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M25 58 Q20 64 26 68" stroke="#93C5FD" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M92 55 Q98 62 92 70" stroke="#93C5FD" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M95 58 Q100 64 94 68" stroke="#93C5FD" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* 目 - 半目クール */}
      <ellipse cx="46" cy="56" rx="7" ry="6" fill="white" stroke="#3B4F6B" strokeWidth="1.5" />
      <ellipse cx="74" cy="56" rx="7" ry="6" fill="white" stroke="#3B4F6B" strokeWidth="1.5" />
      <ellipse cx="47" cy="57" rx="5" ry="4.5" fill="#3B82F6" />
      <ellipse cx="75" cy="57" rx="5" ry="4.5" fill="#3B82F6" />
      <ellipse cx="47" cy="57" rx="3.5" ry="3.5" fill="#1E3A5F" />
      <ellipse cx="75" cy="57" rx="3.5" ry="3.5" fill="#1E3A5F" />
      <ellipse cx="49" cy="55.5" rx="1.8" ry="1.8" fill="white" />
      <ellipse cx="77" cy="55.5" rx="1.8" ry="1.8" fill="white" />
      {/* まぶた（半目） */}
      <path d="M39 52 Q46 49 53 52" stroke="#BFDBFE" strokeWidth="4" fill="#BFDBFE" />
      <path d="M67 52 Q74 49 81 52" stroke="#BFDBFE" strokeWidth="4" fill="#BFDBFE" />
      {/* 鼻 */}
      <path d="M58 66 L60 68 L62 66 Z" fill="#3B82F6" stroke="#3B4F6B" strokeWidth="0.8" />
      {/* 口 - ツン */}
      <path d="M60 68 L60 70" stroke="#3B4F6B" strokeWidth="1.2" />
      <path d="M55 72 Q60 74 65 72" stroke="#3B4F6B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* ほっぺ */}
      <circle cx="36" cy="66" r="6" fill="#60A5FA" opacity="0.18" />
      <circle cx="84" cy="66" r="6" fill="#60A5FA" opacity="0.18" />
      {/* ひげ */}
      <path d="M20 60 Q33 59 40 62" stroke="#3B4F6B" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
      <path d="M19 67 Q33 67 40 66" stroke="#3B4F6B" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
      <path d="M100 60 Q87 59 80 62" stroke="#3B4F6B" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
      <path d="M101 67 Q87 67 80 66" stroke="#3B4F6B" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

// トラ: グリーン系・虎柄・貫禄
function Tora({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* 背景円 */}
      <circle cx="60" cy="60" r="56" fill="#F0FDF4" />
      {/* 耳 - どっしり */}
      <path d="M26 40 Q16 10 44 28" fill="#BBF7D0" stroke="#3D5A3E" strokeWidth="2" />
      <path d="M94 40 Q104 10 76 28" fill="#BBF7D0" stroke="#3D5A3E" strokeWidth="2" />
      <path d="M28 36 Q22 14 42 30" fill="#4ADE80" opacity="0.4" />
      <path d="M92 36 Q98 14 78 30" fill="#4ADE80" opacity="0.4" />
      {/* 顔 - やや大きめ */}
      <ellipse cx="60" cy="62" rx="36" ry="32" fill="#BBF7D0" stroke="#3D5A3E" strokeWidth="2.5" />
      {/* 白い部分 */}
      <ellipse cx="60" cy="72" rx="22" ry="16" fill="#F0FFF4" />
      {/* 虎柄 */}
      <path d="M48 34 Q52 26 56 34" stroke="#16A34A" strokeWidth="2.5" fill="none" opacity="0.5" />
      <path d="M64 34 Q68 26 72 34" stroke="#16A34A" strokeWidth="2.5" fill="none" opacity="0.5" />
      <path d="M56 30 Q60 22 64 30" stroke="#16A34A" strokeWidth="2.5" fill="none" opacity="0.5" />
      <path d="M40 44 Q44 38 48 44" stroke="#16A34A" strokeWidth="2" fill="none" opacity="0.35" />
      <path d="M72 44 Q76 38 80 44" stroke="#16A34A" strokeWidth="2" fill="none" opacity="0.35" />
      {/* 目 - しっかり見据える */}
      <ellipse cx="45" cy="56" rx="7.5" ry="8" fill="white" stroke="#3D5A3E" strokeWidth="1.5" />
      <ellipse cx="75" cy="56" rx="7.5" ry="8" fill="white" stroke="#3D5A3E" strokeWidth="1.5" />
      <ellipse cx="46" cy="57" rx="5.5" ry="6" fill="#22C55E" />
      <ellipse cx="76" cy="57" rx="5.5" ry="6" fill="#22C55E" />
      <ellipse cx="46" cy="57" rx="3.8" ry="4.5" fill="#14532D" />
      <ellipse cx="76" cy="57" rx="3.8" ry="4.5" fill="#14532D" />
      <ellipse cx="48.5" cy="54.5" rx="2" ry="2.2" fill="white" />
      <ellipse cx="78.5" cy="54.5" rx="2" ry="2.2" fill="white" />
      <ellipse cx="45" cy="58.5" rx="1" ry="1" fill="white" opacity="0.6" />
      <ellipse cx="75" cy="58.5" rx="1" ry="1" fill="white" opacity="0.6" />
      {/* 鼻 - 大きめ */}
      <path d="M57 66 L60 69 L63 66 Z" fill="#15803D" stroke="#3D5A3E" strokeWidth="0.8" />
      {/* 口 */}
      <path d="M60 69 L60 72" stroke="#3D5A3E" strokeWidth="1.3" />
      <path d="M53 73 Q60 78 67 73" stroke="#3D5A3E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* ほっぺ */}
      <circle cx="34" cy="66" r="7.5" fill="#4ADE80" opacity="0.22" />
      <circle cx="86" cy="66" r="7.5" fill="#4ADE80" opacity="0.22" />
      {/* ひげ - 立派3本 */}
      <path d="M16 57 Q30 56 38 61" stroke="#3D5A3E" strokeWidth="1.3" opacity="0.45" strokeLinecap="round" />
      <path d="M14 64 Q30 64 38 64" stroke="#3D5A3E" strokeWidth="1.3" opacity="0.45" strokeLinecap="round" />
      <path d="M16 71 Q30 70 38 67" stroke="#3D5A3E" strokeWidth="1.3" opacity="0.45" strokeLinecap="round" />
      <path d="M104 57 Q90 56 82 61" stroke="#3D5A3E" strokeWidth="1.3" opacity="0.45" strokeLinecap="round" />
      <path d="M106 64 Q90 64 82 64" stroke="#3D5A3E" strokeWidth="1.3" opacity="0.45" strokeLinecap="round" />
      <path d="M104 71 Q90 70 82 67" stroke="#3D5A3E" strokeWidth="1.3" opacity="0.45" strokeLinecap="round" />
    </svg>
  );
}

const catComponents: Record<CatName, React.ComponentType<{ size: number }>> = {
  モチ: Mochi,
  カゼ: Kaze,
  スミ: Sumi,
  トラ: Tora,
};

export function CatIcon({ name, size = 48, className }: CatIconProps) {
  const CatComponent = catComponents[name];
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      <CatComponent size={size} />
    </div>
  );
}
