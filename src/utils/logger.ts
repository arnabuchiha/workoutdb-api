import { Context, MiddlewareHandler } from "hono";

export const logger = (): MiddlewareHandler => {
  return async (c: Context, next: () => Promise<void>) => {
    const start = Date.now();
    await next();
    const end = Date.now();
    const time = end - start;

    console.log(`[${c.req.method}] ${c.req.url} - ${time}ms`);
  };
};
