import { Hono } from "hono";
import type { Env } from "../../types";
import { BodyPartController } from "../../controllers/bodyPartController";
import { DbClient } from "../../db";

const router = new Hono<{
  Bindings: Env;
  Variables: {
    db: DbClient;
    user?: { id: string } | null;
  };
}>();

const controller = new BodyPartController();

// Body part routes
router.get("/", (c) => controller.getBodyParts(c));
router.get("/:bodyPart/workouts", (c) => controller.getWorkoutsByBodyPart(c));

export const bodyPartRouter = router;
