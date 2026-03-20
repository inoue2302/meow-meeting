export type CatName = "モチ" | "カゼ" | "スミ" | "トラ";

export interface Cat {
  name: CatName;
  role: string;
  color: string;
  bgColor: string;
  description: string;
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
