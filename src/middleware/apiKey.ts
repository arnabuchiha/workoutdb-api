import { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const apiKeyMiddleware: MiddlewareHandler = async (
  c: Context,
  next: () => Promise<void>,
) => {
  const apiKey = c.req.header("X-API-Key");

  if (!apiKey) {
    throw new HTTPException(401, { message: "API key is required" });
  }

  // In a real application, you would validate the API key against your database
  // For this example, we'll use a simple check
  if (apiKey !== process.env.API_KEY) {
    throw new HTTPException(401, { message: "Invalid API key" });
  }

  await next();
};
