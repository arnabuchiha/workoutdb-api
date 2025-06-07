import { Context } from "hono";
import type { Env } from "../types";
import { DbClient } from "../db";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { muscles, workouts, workoutMuscleActivations } from "../db/schema";
import { MuscleSchema, MuscleArraySchema } from "../schemas/muscle";
import { eq, and, getTableColumns } from "drizzle-orm";

type MuscleContext = Context<{
  Bindings: Env;
  Variables: {
    db: DbClient;
    user?: { id: string } | null;
  };
}>;

export class MusclesController {
  async getMuscles(c: MuscleContext) {
    try {
      const db = c.get("db");
      const page = parseInt(c.req.query("page") || "1");
      const pageSize = Math.min(parseInt(c.req.query("pageSize") || "20"), 50);

      const result = await db
        .select()
        .from(muscles)
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .execute();

      return c.json({
        data: result,
        page,
        pageSize,
        total: result.length,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw new HTTPException(400, {
          message: `Invalid payload format: ${err.errors.map((e) => e.message).join(", ")}`,
        });
      }

      console.error(err);
      throw new HTTPException(500, {
        message: "Failed to fetch muscles",
      });
    }
  }

  async createMuscle(c: MuscleContext) {
    try {
      const payload = await c.req.json();
      const db = c.get("db");
      const musclesToInsert = MuscleSchema.parse(payload);

      const inserted = await db
        .insert(muscles)
        .values({
          code: musclesToInsert.Code,
          name: musclesToInsert.Muscle,
          groupName: musclesToInsert.Group,
        })
        .returning();

      return c.json({
        message: "Muscles created successfully",
        count: inserted.length,
        data: inserted,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw new HTTPException(400, {
          message: `Invalid payload format: ${err.errors.map((e) => e.message).join(", ")}`,
        });
      }

      console.error(err);
      throw new HTTPException(500, {
        message: "Failed to create muscles",
      });
    }
  }

  async createMuscleBulk(c: MuscleContext) {
    try {
      const payload = await c.req.json();
      const db = c.get("db");
      const musclesToInsert = MuscleArraySchema.parse(payload);

      const inserted = await db
        .insert(muscles)
        .values(
          musclesToInsert.map(({ Code, Muscle, Group }) => ({
            code: Code,
            name: Muscle,
            groupName: Group,
          })),
        )
        .returning();

      return c.json({
        message: "Muscles created successfully",
        count: inserted.length,
        data: inserted,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw new HTTPException(400, {
          message: `Invalid payload format: ${err.errors.map((e) => e.message).join(", ")}`,
        });
      }

      console.error(err);
      throw new HTTPException(500, {
        message: "Failed to create muscles",
      });
    }
  }

  async getWorkoutsByMuscle(c: MuscleContext) {
    try {
      const muscleId = c.req.param("muscleId");
      const db = c.get("db");
      const page = parseInt(c.req.query("page") || "1");
      const pageSize = Math.min(parseInt(c.req.query("pageSize") || "20"), 50);
      const isPrimary = c.req.query("isPrimary") === "true";

      // First verify the muscle exists
      const muscle = await db
        .select()
        .from(muscles)
        .where(eq(muscles.code, muscleId))
        .execute();

      if (!muscle.length) {
        throw new HTTPException(404, { message: "Muscle not found" });
      }

      // Get workouts with muscle activations
      const { muscleVector, searchVector, ...selectedColumns } =
        getTableColumns(workouts);

      const result = await db
        .select({
          ...selectedColumns,
          activation: workoutMuscleActivations.activation,
          isPrimary: workoutMuscleActivations.isPrimary,
        })
        .from(workouts)
        .innerJoin(
          workoutMuscleActivations,
          eq(workouts.id, workoutMuscleActivations.workoutId),
        )
        .where(
          and(
            eq(workoutMuscleActivations.muscleCode, muscleId),
            isPrimary !== undefined
              ? eq(workoutMuscleActivations.isPrimary, isPrimary)
              : undefined,
          ),
        )
        .orderBy(workoutMuscleActivations.activation)
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .execute();

      return c.json({
        data: result,
        page,
        pageSize,
        total: result.length,
        muscle: muscle[0],
      });
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      console.error(err);
      throw new HTTPException(500, {
        message: "Failed to get workouts by muscle",
      });
    }
  }
}
