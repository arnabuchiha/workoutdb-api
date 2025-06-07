import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { workouts } from "../db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import type { Env } from "../types";
import type { DbClient } from "../db";

type BodyPartContext = Context<{
  Bindings: Env;
  Variables: {
    db: DbClient;
    user?: { id: string } | null;
  };
}>;

export class BodyPartController {
  async getBodyParts(c: BodyPartContext) {
    try {
      const db = c.get("db");
      const page = parseInt(c.req.query("page") || "1");
      const pageSize = Math.min(parseInt(c.req.query("pageSize") || "20"), 50);

      // Get unique body parts from workouts
      const result = await db
        .select({ bodyPart: workouts.bodyPart })
        .from(workouts)
        .groupBy(workouts.bodyPart)
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .execute();

      return c.json({
        data: result.map((r) => r.bodyPart),
        page,
        pageSize,
        total: result.length,
      });
    } catch (err) {
      console.error(err);
      throw new HTTPException(500, {
        message: "Failed to fetch body parts",
      });
    }
  }

  async getWorkoutsByBodyPart(c: BodyPartContext) {
    try {
      const bodyPart = c.req.param("bodyPart");
      const db = c.get("db");
      const page = parseInt(c.req.query("page") || "1");
      const pageSize = Math.min(parseInt(c.req.query("pageSize") || "20"), 50);

      // First verify if body part exists
      const bodyPartExists = await db
        .select({ bodyPart: workouts.bodyPart })
        .from(workouts)
        .where(eq(workouts.bodyPart, bodyPart))
        .limit(1)
        .execute();

      if (!bodyPartExists.length) {
        throw new HTTPException(404, { message: "Body part not found" });
      }

      // Get workouts for the body part
      const { muscleVector, searchVector, ...selectedColumns } =
        getTableColumns(workouts);

      const result = await db
        .select({ ...selectedColumns })
        .from(workouts)
        .where(eq(workouts.bodyPart, bodyPart))
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .execute();

      return c.json({
        data: result,
        page,
        pageSize,
        total: result.length,
        bodyPart,
      });
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      console.error(err);
      throw new HTTPException(500, {
        message: "Failed to get workouts by body part",
      });
    }
  }
}
