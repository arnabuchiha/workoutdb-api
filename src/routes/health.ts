import { Hono } from "hono";
import type { Env } from "../types";
import { AppHealthController } from "../controllers/appHealthController";
import { DbClient } from "../db";

const router = new Hono<{
  Bindings: Env;
  Variables: {
    db: DbClient;
    user?: { id: string } | null;
  };
}>();
const controller = new AppHealthController();

router.get("/", (c) => controller.getHealth(c));
router.get("/ping", (c) => controller.ping(c));

export const healthRouter = router;
