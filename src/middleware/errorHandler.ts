import { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorHandler = (): MiddlewareHandler => {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof HTTPException) {
        return c.json(
          {
            success: false,
            message: err.message,
            status: err.status,
          },
          err.status,
        );
      }

      console.error("Unhandled error:", err);
      return c.json(
        {
          success: false,
          message: "Internal Server Error",
          status: 500,
        },
        500,
      );
    }
  };
};
