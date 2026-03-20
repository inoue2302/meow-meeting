export const CAT_NAMES = ["モチ", "カゼ", "スミ", "トラ"] as const;
export type CatName = (typeof CAT_NAMES)[number];

export interface Cat {
  name: CatName;
  role: string;
  color: string;
  bgColor: string;
  description: string;
  quotes: string[];
}

export interface Question {
  question: string;
  options: string[];
}

export interface Theme {
  id: number;
  label: string;
  questions: Question[];
}

export interface HearingResult {
  themeId: number;
  answers: string[];
}
