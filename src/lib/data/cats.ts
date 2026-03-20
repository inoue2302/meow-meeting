import { Cat, CatName } from "@/lib/types";

export const cats: Record<CatName, Cat> = {
  モチ: {
    name: "モチ",
    role: "共感担当",
    color: "text-pink-700",
    bgColor: "bg-pink-100",
    description: "まず受け止める、共感する。もちもち丸い、やさしい存在。",
  },
  カゼ: {
    name: "カゼ",
    role: "行動担当",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    description:
      "背中を押す、勢いがある。風みたいにふらっと来てふらっと去る。",
  },
  スミ: {
    name: "スミ",
    role: "分析担当",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    description: "クールで現実的、ズバッと言う。墨色の猫、静かでミステリアス。",
  },
  トラ: {
    name: "トラ",
    role: "進行+まとめ担当",
    color: "text-green-700",
    bgColor: "bg-green-100",
    description:
      "ヒアリングから会議進行、結論まで一貫して担当。虎柄、貫禄あり。",
  },
};
