import { Hono } from "hono";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";

// Import routes
import { authRouter } from "./routes/authRoute";
import { healthRouter } from "./routes/health";
import { workoutsRouter } from "./routes/workouts";
import { auth } from "./utils/auth";
import { Env } from "./types";
import { createDbClient } from "./db";
import type { DbClient } from "./db";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
    db: DbClient;
  };
  Bindings: Env;
}>();

// Middleware to initialize Supabase client and Drizzle
app.use("*", async (c, next) => {
  const db = createDbClient(c.env.DATABASE_URL);
  c.set("db", db);
  await next();
});

// Global middleware
app.use("*", logger());
app.use("*", errorHandler());
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

app.route("/health", healthRouter);
app.route("/auth", authRouter);

// Protected routes
// app.use("/api/*", apiKeyMiddleware);
// app.use("/api/*", rateLimitMiddleware);
app.route("/api/workouts", workoutsRouter);

export default app;
