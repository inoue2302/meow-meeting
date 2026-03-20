"use client";

import Image from "next/image";
import { CatName } from "@/lib/types";

interface CatIconProps {
  name: CatName;
  size?: number;
  className?: string;
}

const catImagePaths: Record<CatName, string> = {
  モチ: "/cats/mochi.png",
  カゼ: "/cats/kaze.png",
  スミ: "/cats/sumi.png",
  トラ: "/cats/tora.png",
};

export function CatIcon({ name, size = 48, className }: CatIconProps) {
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      <Image
        src={catImagePaths[name]}
        alt={`${name}のアイコン`}
        width={size}
        height={size}
      />
    </div>
  );
}
