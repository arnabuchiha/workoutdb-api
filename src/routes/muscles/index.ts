import { Hono } from "hono";
import type { Env } from "../../types";
import { MusclesController } from "../../controllers/musclesController";
import { DbClient } from "../../db";

const router = new Hono<{
  Bindings: Env;
  Variables: {
    db: DbClient;
    user?: { id: string } | null;
  };
}>();

const controller = new MusclesController();

// Muscle routes
router.get("/", (c) => controller.getMuscles(c));
router.post("/", (c) => controller.createMuscle(c));
router.post("/batch", (c) => controller.createMuscleBulk(c));
router.get("/:muscleId/workouts", (c) => controller.getWorkoutsByMuscle(c));

export const musclesRouter = router;
