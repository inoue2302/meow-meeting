import { peekRateLimit } from "@/lib/rate-limit";

export async function GET() {
  try {
    const { allowed, remaining } = await peekRateLimit();
    return Response.json({ allowed, remaining });
  } catch {
    // Redis障害時はフェイルオープン
    return Response.json({ allowed: true, remaining: -1 });
  }
}
