import { Context } from "hono";
import { DbClient } from "../db";
import { Env } from "../types";
import { workouts } from "../db/schema";
import { sql } from "drizzle-orm";

type AppHealthContext = Context<{
  Bindings: Env;
  Variables: {
    db: DbClient;
    user?: { id: string } | null;
  };
}>;

export class AppHealthController {
  async getHealth(c: AppHealthContext) {
    return c.json({ status: "ok" });
  }
  async ping(c: AppHealthContext) {
    const db = c.get("db");
    // ping db to check db alive light weight
    const beforeQuery = Date.now();
    await db.execute(sql`select 1`);
    const afterQuery = Date.now();
    const latency = afterQuery - beforeQuery;
    return c.json({ status: "pong", latency });
  }
}
