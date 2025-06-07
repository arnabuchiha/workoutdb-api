import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { workouts } from "../db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import type { Env } from "../types";
import type { DbClient } from "../db";

type EquipmentContext = Context<{
  Bindings: Env;
  Variables: {
    db: DbClient;
    user?: { id: string } | null;
  };
}>;

export class EquipmentController {
  async getEquipments(c: EquipmentContext) {
    try {
      const db = c.get("db");
      const page = parseInt(c.req.query("page") || "1");
      const pageSize = Math.min(parseInt(c.req.query("pageSize") || "20"), 50);

      // Get unique equipments from workouts
      const result = await db
        .select({ equipment: workouts.equipment })
        .from(workouts)
        .groupBy(workouts.equipment)
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .execute();

      return c.json({
        data: result.map((r) => r.equipment),
        page,
        pageSize,
        total: result.length,
      });
    } catch (err) {
      console.error(err);
      throw new HTTPException(500, {
        message: "Failed to fetch equipments",
      });
    }
  }

  async getWorkoutsByEquipment(c: EquipmentContext) {
    try {
      const equipment = c.req.param("equipment");
      const db = c.get("db");
      const page = parseInt(c.req.query("page") || "1");
      const pageSize = Math.min(parseInt(c.req.query("pageSize") || "20"), 50);

      // First verify if equipment exists
      const equipmentExists = await db
        .select({ equipment: workouts.equipment })
        .from(workouts)
        .where(eq(workouts.equipment, equipment))
        .limit(1)
        .execute();

      if (!equipmentExists.length) {
        throw new HTTPException(404, { message: "Equipment not found" });
      }

      // Get workouts for the equipment
      const { muscleVector, searchVector, ...selectedColumns } =
        getTableColumns(workouts);

      const result = await db
        .select({ ...selectedColumns })
        .from(workouts)
        .where(eq(workouts.equipment, equipment))
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .execute();

      return c.json({
        data: result,
        page,
        pageSize,
        total: result.length,
        equipment,
      });
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      console.error(err);
      throw new HTTPException(500, {
        message: "Failed to get workouts by equipment",
      });
    }
  }
}
