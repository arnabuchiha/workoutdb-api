import { Hono } from "hono";
import type { Env } from "../../types";
import { WorkoutsController } from "../../controllers/workoutsController";
import { DbClient } from "../../db";
import { AdminCheck } from "../../middleware/roleCheck";

const router = new Hono<{
  Bindings: Env;
  Variables: {
    db: DbClient;
    user?: { id: string } | null;
  };
}>();
const controller = new WorkoutsController();

router.get("/search/query", (c) => controller.searchWorkouts(c));
router.get("/search/suggestions", (c) => controller.getWorkoutSuggestions(c));
router.get("/search/autocomplete", (c) => controller.autoCompleteWorkout(c));
router.get("/:id/alternatives", (c) => controller.getAlternativeWorkouts(c));
router.get("/muscleActivations", (c) =>
  controller.getWorkoutMuscleActivations(c),
);
router.get("/:id/muscleActivations", (c) =>
  controller.getMuscleActivationsByWorkoutId(c),
);
router.put("/batch/update", AdminCheck(), (c) =>
  controller.updateWorkoutInBulk(c),
);
router.post("/batch", AdminCheck(), (c) => controller.createWorkoutInBulk(c));

router.get("/:id", (c) => controller.getWorkoutById(c));
router.put("/:id", AdminCheck(), (c) => controller.updateWorkout(c));
router.delete("/:id", AdminCheck(), (c) => controller.deleteWorkout(c));

router.get("/", (c) => controller.getWorkouts(c));
router.post("/", AdminCheck(), (c) => controller.createWorkout(c));

export const workoutsRouter = router;
