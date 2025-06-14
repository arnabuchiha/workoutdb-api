import { Hono } from "hono";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/authRoute";
import { healthRouter } from "./routes/health";
import { workoutsRouter } from "./routes/workouts";
import { musclesRouter } from "./routes/muscles";
import { equipmentRouter } from "./routes/equipment";
import { bodyPartRouter } from "./routes/bodyPart";
import { auth } from "./utils/auth";
import { Env } from "./types";
import { createDbClient } from "./db";
import type { DbClient } from "./db";
import { scalarDocs } from "./controllers/docsController";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
    db: DbClient;
  };
  Bindings: Env;
}>();

// Middleware to initialize Supabase client and Drizzle
app.use("/api/*", async (c, next) => {
  const rapidApiKey = c.env.RAPID_API_SECRET;
  const reqSecret = c.req.header("X-RapidAPI-Proxy-Secret");
  if (c.env.ENVIRONMENT === "production" && reqSecret !== rapidApiKey) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const db = createDbClient(c.env.DATABASE_URL);
  c.set("db", db);
  await next();
});
app.route("/api/health", healthRouter);
// Global middleware
app.use("/api/*", logger());
app.use("/api/*", errorHandler());
// app.use("/api/*", async (c, next) => {
//   const session = await auth.api.getSession({ headers: c.req.raw.headers });

//   if (!session) {
//     c.set("user", null);
//     c.set("session", null);
//     return next();
//   }

//   c.set("user", session.user);
//   c.set("session", session.session);
//   return next();
// });
// API routes

app.route("/api/auth", authRouter);

// Protected routes
// app.use("/api/*", apiKeyMiddleware);
// app.use("/api/*", rateLimitMiddleware);
app.route("/api/workouts", workoutsRouter);
app.route("/api/muscles", musclesRouter);
app.route("/api/equipment", equipmentRouter);
app.route("/api/body-parts", bodyPartRouter);

app.get("/docs", scalarDocs);
export default app;
