import { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

// Simple in-memory store for rate limiting
// In production, use Redis or similar
const requestStore = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export const rateLimitMiddleware: MiddlewareHandler = async (
  c: Context,
  next: () => Promise<void>,
) => {
  const ip = c.req.header("CF-Connecting-IP") || "unknown";
  const now = Date.now();

  const userRequests = requestStore.get(ip) || {
    count: 0,
    resetTime: now + WINDOW_MS,
  };

  if (now > userRequests.resetTime) {
    userRequests.count = 0;
    userRequests.resetTime = now + WINDOW_MS;
  }

  if (userRequests.count >= MAX_REQUESTS) {
    throw new HTTPException(429, { message: "Too many requests" });
  }

  userRequests.count++;
  requestStore.set(ip, userRequests);

  c.header("X-RateLimit-Limit", MAX_REQUESTS.toString());
  c.header(
    "X-RateLimit-Remaining",
    (MAX_REQUESTS - userRequests.count).toString(),
  );
  c.header(
    "X-RateLimit-Reset",
    Math.ceil(userRequests.resetTime / 1000).toString(),
  );

  await next();
};
