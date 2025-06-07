import { Hono } from "hono";
import type { Env } from "../../types";
import { EquipmentController } from "../../controllers/equipmentController";
import { DbClient } from "../../db";

const router = new Hono<{
  Bindings: Env;
  Variables: {
    db: DbClient;
    user?: { id: string } | null;
  };
}>();

const controller = new EquipmentController();

// Equipment routes
router.get("/", (c) => controller.getEquipments(c));
router.get("/:equipment/workouts", (c) => controller.getWorkoutsByEquipment(c));

export const equipmentRouter = router;
