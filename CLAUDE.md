@AGENTS.md

# meow-meeting (にゃんず進路会議)

AI時代のキャリア不安を猫4匹の作戦会議で癒すアプリ。

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Vercel AI SDK (`streamObject` + Zod)
- Anthropic API (Claude)

## プロジェクト構成

```
src/
  app/
    page.tsx          # トップ画面
    globals.css       # グローバルスタイル
    layout.tsx        # ルートレイアウト
    api/meeting/      # streamObject APIエンドポイント
  lib/
    data/             # テーマ・選択肢の固定データ
    schema.ts         # Zodスキーマ（LLM出力型定義）
    prompt.ts         # システムプロンプト構築
    types.ts          # TypeScript型定義
  components/
    ui/               # shadcn/ui コンポーネント
    TopScreen.tsx     # トップ画面
    Hearing.tsx       # ヒアリング（トラとの会話）
    Meeting.tsx       # 会議画面（吹き出しストリーミング）
    PokapokaBattle.tsx # ポカポカ喧嘩アニメーション
    Conclusion.tsx    # 結論カード
```

## 開発コマンド

```bash
npm run dev    # 開発サーバー起動
npm run build  # ビルド
npm run lint   # ESLint
```

## 環境変数

```
ANTHROPIC_API_KEY=  # .env.local に配置
```

## 設計原則

- 自由入力は一切なし（選択式のみ）
- API呼び出しは1回のみ（streamObject）
- 猫は2次元イラスト限定（リアル猫NG）
- 結論は必ずポジティブ + 背中を押すトーン
- 風刺は「気づき」のため。落とすためではなく、笑って前を向くため

## キャラクター

| 名前 | 役割 | 色 |
|------|------|-----|
| モチ | 共感担当 | ピンク |
| カゼ | 行動担当 | オレンジ |
| スミ | 分析担当 | ブルー |
| トラ | 進行+まとめ | グリーン |
