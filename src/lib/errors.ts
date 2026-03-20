export class RateLimitedError extends Error {
  constructor() {
    super("RATE_LIMITED");
    this.name = "RateLimitedError";
  }
}
