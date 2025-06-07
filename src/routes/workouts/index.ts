import { Hono } from "hono";
import type { Env } from "../../types";
import { WorkoutsController } from "../../controllers/workoutsController";
import { DbClient } from "../../db";

const router = new Hono<{
  Bindings: Env;
  Variables: {
    db: DbClient;
    user?: { id: string } | null;
  };
}>();
const controller = new WorkoutsController();

// Premium feature routes
router.get("/search/query", (c) => controller.searchWorkouts(c));
router.get("/search/suggestions", (c) => controller.getWorkoutSuggestions(c));
router.get("/search/autocomplete", (c) => controller.autoCompleteWorkout(c));
router.get("/:id/alternatives", (c) => controller.getAlternativeWorkouts(c));

// Batch operations
router.post("/batch", (c) => controller.createWorkoutInBulk(c));

// Basic CRUD operations
router.get("/:id", (c) => controller.getWorkoutById(c));
router.put("/:id", (c) => controller.updateWorkout(c));
router.delete("/:id", (c) => controller.deleteWorkout(c));

// Collection routes
router.get("/", (c) => controller.getWorkouts(c));
router.post("/", (c) => controller.createWorkout(c));

export const workoutsRouter = router;
