import { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const AdminCheck = (): MiddlewareHandler => {
  return async (c: Context, next: () => Promise<void>) => {
    const adminKey = c.req.header("x-admin-key");
    if (!c.env.ADMIN_KEY) {
      return c.json(
        {
          message: "ADMIN_KEY is not set in environment",
        },
        500,
      );
    }
    if (c.env.ENVIRONMENT === "production" && adminKey !== c.env.ADMIN_KEY) {
      return c.json(
        {
          message: "Unauthorized: Invalid admin key",
        },
        401,
      );
    }
    await next();
  };
};
