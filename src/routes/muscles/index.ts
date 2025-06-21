import { Hono } from "hono";
import type { Env } from "../../types";
import { MusclesController } from "../../controllers/musclesController";
import { DbClient } from "../../db";
import { AdminCheck } from "../../middleware/roleCheck";

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
router.post("/", AdminCheck(), (c) => controller.createMuscle(c));
router.post("/batch", AdminCheck(), (c) => controller.createMuscleBulk(c));
router.get("/:muscleId/workouts", (c) => controller.getWorkoutsByMuscle(c));
router.put("/activations/bulk", AdminCheck(), (c) =>
  controller.updateMuscleActivationBulk(c),
);

export const musclesRouter = router;
