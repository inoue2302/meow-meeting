"use client";

import Image from "next/image";
import { CatName } from "@/lib/types";

interface CatIconProps {
  name: CatName;
  size?: number;
  className?: string;
}

const catSvgPaths: Record<CatName, string> = {
  モチ: "/cats/mochi.svg",
  カゼ: "/cats/kaze.svg",
  スミ: "/cats/sumi.svg",
  トラ: "/cats/tora.svg",
};

export function CatIcon({ name, size = 48, className }: CatIconProps) {
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      <Image
        src={catSvgPaths[name]}
        alt={`${name}のアイコン`}
        width={size}
        height={size}
      />
    </div>
  );
}
