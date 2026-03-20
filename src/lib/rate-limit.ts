import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(100, "24 h"),
});

const GLOBAL_KEY = "meow-meeting-global";

export async function checkRateLimit(): Promise<{
  allowed: boolean;
  remaining: number;
}> {
  const { success, remaining } = await ratelimit.limit(GLOBAL_KEY);
  return { allowed: success, remaining };
}
