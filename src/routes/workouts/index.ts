import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { Env } from "../../types";
import { workouts } from "../../db/schema";

const router = new Hono<{ Bindings: Env }>();

// Forward search requests to premium module
router.get("/search", async (c) => {
  const query = c.req.query("q");
  if (!query) {
    throw new HTTPException(400, { message: "Search query is required" });
  }

  // Create a new request to forward to the premium module
  const url = new URL("/search", "http://internal");
  url.searchParams.set("q", query);
  const req = new Request(url, {
    headers: new Headers(c.req.raw.headers),
  });
});

// Forward autocomplete requests to premium module
router.get("/autocomplete", async (c) => {
  const query = c.req.query("q");
  if (!query) {
    throw new HTTPException(400, { message: "Query parameter is required" });
  }

  const url = new URL("/autocomplete", "http://internal");
  url.searchParams.set("q", query);
  const req = new Request(url, {
    headers: new Headers(c.req.raw.headers),
  });
});

// Forward alternates requests to premium module
router.get("/alternates/:id", async (c) => {
  const id = c.req.param("id");
  console.log(c.env.BETTER_AUTH_SECRET);
  const url = new URL(`/`, "http://internal");
  const req = new Request(url, {
    headers: new Headers(c.req.raw.headers),
  });
});
router.get("/test", async (c) => {
  const db = c.get("db");
  const query = db.select().from(workouts);
  // result.execute()
  const result = await query.execute();
  return c.json(result);
});
export const workoutsRouter = router;
