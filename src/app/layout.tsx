import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "にゃんず進路会議",
  description:
    "AI時代のキャリア不安を猫4匹の作戦会議で癒すアプリ。AIの話、人間に聞いても不安になるだけ。猫に聞こう。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${zenMaruGothic.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-amber-50 text-foreground font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
