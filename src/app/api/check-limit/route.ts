import { getRemainingLimit } from "@/lib/rate-limit";

export async function GET() {
  const { allowed, remaining } = await getRemainingLimit();
  return Response.json({ allowed, remaining });
}
