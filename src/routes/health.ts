import { Hono } from "hono";
import type { Env } from "../types";

const router = new Hono<{ Bindings: Env }>();

router.get("/", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: c.env.VERSION || "1.0.0",
    environment: c.env.ENVIRONMENT || "development",
  });
});

export const healthRouter = router;
