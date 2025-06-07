import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { muscles, workouts, workoutMuscleActivations } from "../db/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import type { Env } from "../types";
import type { DbClient } from "../db";
import { z } from "zod";
import { BulkWorkoutArraySchema } from "../schemas/workout";

type WorkoutContext = Context<{
  Bindings: Env;
  Variables: {
    db: DbClient;
    user?: { id: string } | null;
  };
}>;

export class WorkoutsController {
  // Get all workouts (with pagination and filters)
  async getWorkouts(c: WorkoutContext) {
    try {
      const db = c.get("db");
      const page = parseInt(c.req.query("page") || "1");
      const pageSize = Math.min(parseInt(c.req.query("pageSize") || "20"), 50);
      const { muscleVector, searchVector, ...selectedColumns } =
        getTableColumns(workouts);
      const result = await db
        .select({ ...selectedColumns })
        .from(workouts)
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .execute();
      return c.json({
        data: result,
        page,
        pageSize,
        total: result.length,
      });
    } catch (error) {
      throw new HTTPException(500, { message: "Failed to fetch workouts" });
    }
  }

  // Get a single workout by ID
  async getWorkoutById(c: WorkoutContext) {
    try {
      const id = c.req.param("id");
      const db = c.get("db");

      // Business logic here:
      // 1. Validate workout exists
      // 2. Check access permissions (public/private)
      // 3. Return workout with related data

      const result = await db
        .select()
        .from(workouts)
        .where(eq(workouts.id, parseInt(id)))
        .execute();

      if (!result.length) {
        throw new HTTPException(404, { message: "Workout not found" });
      }

      return c.json(result[0]);
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to fetch workout" });
    }
  }

  // Create a new workout
  async createWorkout(c: WorkoutContext) {
    try {
      const body = await c.req.json();
      const db = c.get("db");
      const userId = c.get("user")?.id;

      if (!userId) {
        throw new HTTPException(401, { message: "Authentication required" });
      }

      // Business logic here:
      // 1. Validate request body
      // 2. Process and sanitize input
      // 3. Add metadata (userId, timestamps)
      // 4. Create workout record

      const result = await db
        .insert(workouts)
        .values({
          ...body,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()
        .execute();

      return c.json(result[0], 201);
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to create workout" });
    }
  }

  // Update a workout
  async updateWorkout(c: WorkoutContext) {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      const db = c.get("db");
      const userId = c.get("user")?.id;

      if (!userId) {
        throw new HTTPException(401, { message: "Authentication required" });
      }

      // Business logic here:
      // 1. Validate workout exists
      // 2. Check ownership/permissions
      // 3. Validate and sanitize updates
      // 4. Apply updates

      const result = await db
        .update(workouts)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(workouts.id, parseInt(id)))
        .returning()
        .execute();

      if (!result.length) {
        throw new HTTPException(404, { message: "Workout not found" });
      }

      return c.json(result[0]);
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to update workout" });
    }
  }

  // Delete a workout
  async deleteWorkout(c: WorkoutContext) {
    try {
      const id = c.req.param("id");
      const db = c.get("db");
      const userId = c.get("user")?.id;

      if (!userId) {
        throw new HTTPException(401, { message: "Authentication required" });
      }

      // Business logic here:
      // 1. Validate workout exists
      // 2. Check ownership/permissions
      // 3. Handle related records (if any)
      // 4. Delete workout

      const result = await db
        .delete(workouts)
        .where(eq(workouts.id, parseInt(id)))
        .returning()
        .execute();

      if (!result.length) {
        throw new HTTPException(404, { message: "Workout not found" });
      }

      return c.json({ message: "Workout deleted successfully" });
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Failed to delete workout" });
    }
  }

  // Search workouts
  async searchWorkouts(c: WorkoutContext) {
    try {
      const query = c.req.query("q");
      const page = parseInt(c.req.query("page") || "1");
      const pageSize = Math.min(parseInt(c.req.query("pageSize") || "20"), 50);
      if (!query) {
        throw new HTTPException(400, { message: "Search query is required" });
      }
      const db = c.get("db");

      const tsQuery = sql`plainto_tsquery('english', ${query})`;
      const { muscleVector, searchVector, ...selectedColumns } =
        getTableColumns(workouts);
      const results = await db
        .select({
          ...selectedColumns,
          rank: sql`ts_rank(workouts.search_vector, ${tsQuery})`,
        })
        .from(workouts)
        .where(sql`workouts.search_vector @@ ${tsQuery}`)
        .orderBy(sql`ts_rank(workouts.search_vector, ${tsQuery}) DESC`)
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .execute();
      let combinedResults = results;
      if (results.length < 5) {
        const fuzzyResults = await db
          .select({
            ...getTableColumns(workouts),
            rank: sql`GREATEST(similarity(name, ${query}), similarity(description, ${query}))`,
          })
          .from(workouts)
          .where(
            sql`similarity(name, ${query}) > 0.3 OR similarity(description, ${query}) > 0.3`,
          )
          .orderBy(
            sql`GREATEST(similarity(name, ${query}), similarity(description, ${query})) DESC`,
          )
          .limit(pageSize)
          .execute();
        // Deduplicate by id (or externalId if that's the unique key)
        const seenIds = new Set(results.map((r) => r.id));
        const dedupedFuzzy = fuzzyResults.filter((r) => !seenIds.has(r.id));
        combinedResults = [...results, ...dedupedFuzzy];
      }
      return c.json({
        data: combinedResults,
        page,
        pageSize,
        total: combinedResults.length,
      });
    } catch (error) {
      console.error(error);
      throw new HTTPException(500, { message: "Search failed" });
    }
  }
  async autoCompleteWorkout(c: WorkoutContext) {
    try {
      const query = c.req.query("q");
      const db = c.get("db");

      const tsQuery = sql`plainto_tsquery('english', ${query})`;

      const results = await db
        .select({
          ...getTableColumns(workouts),
          rank: sql`ts_rank(workouts.search_vector, ${tsQuery})`,
        })
        .from(workouts)
        .where(sql`workouts.search_vector @@ ${tsQuery}`)
        .orderBy(sql`ts_rank(workouts.search_vector, ${tsQuery}) DESC`)
        .limit(20)
        .execute();
      return c.json(results);
    } catch (error) {
      console.error(error);
      throw new HTTPException(500, { message: "Failed to get autocomplete" });
    }
  }
  // Get workout suggestions (autocomplete)
  async getWorkoutSuggestions(c: WorkoutContext) {
    try {
      const query = c.req.query("q");
      if (!query) {
        throw new HTTPException(400, {
          message: "Query parameter is required",
        });
      }

      // Business logic here:
      // 1. Process query string
      // 2. Get matching workout names
      // 3. Format suggestions
      // 4. Return top N suggestions

      return c.json({
        message: "Autocomplete functionality to be implemented",
      });
    } catch (error) {
      throw new HTTPException(500, { message: "Failed to get suggestions" });
    }
  }

  // Get alternative workouts
  async getAlternativeWorkouts(c: WorkoutContext) {
    try {
      const id = c.req.param("id");
      const db = c.get("db");
      const page = parseInt(c.req.query("page") || "1");
      const pageSize = Math.min(parseInt(c.req.query("pageSize") || "20"), 50);
      //Remove columns from selected Columns
      const { muscleVector, searchVector, ...selectedColumns } =
        getTableColumns(workouts);
      // 1. Get the muscle vector for the target workout
      const [target] = await db
        .select({ muscleVector: workouts.muscleVector })
        .from(workouts)
        .where(eq(workouts.id, parseInt(id)))
        .execute();

      if (!target || !target.muscleVector) {
        throw new HTTPException(404, {
          message: "Workout or muscle vector not found",
        });
      }
      const alternatives = await db
        .select({
          ...selectedColumns,
          similarity: sql`1 - (muscle_vector <=> ${target.muscleVector})`,
        })
        .from(workouts)
        .where(sql`id != ${id} AND muscle_vector IS NOT NULL`)
        .orderBy(sql`muscle_vector <=> ${target.muscleVector}`)
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .execute();

      return c.json({
        data: alternatives,
        page,
        pageSize,
        total: alternatives.length,
      });
    } catch (error) {
      console.error(error);
      throw new HTTPException(500, { message: "Failed to get alternatives" });
    }
  }

  async createWorkoutInBulk(c: WorkoutContext) {
    try {
      const payload = await c.req.json();
      const db = c.get("db");
      // const userId = c.get("user")?.id;

      // if (!userId) {
      //   throw new HTTPException(401, { message: "Authentication required" });
      // }

      // Validate the payload
      const workoutsToInsert = BulkWorkoutArraySchema.parse(payload);

      // Use a transaction to ensure all related data is inserted
      const result = await db.transaction(async (tx) => {
        const insertedWorkouts = [];

        for (const workout of workoutsToInsert) {
          // Insert the workout
          const [insertedWorkout] = await tx
            .insert(workouts)
            .values({
              externalId: workout.id,
              name: workout.name,
              description: "", // Add if needed
              bodyPart: workout.bodyPart,
              equipment: workout.equipment,
              gifUrl: workout.gifUrl,
              target: workout.target,
              secondaryMuscles: workout.secondaryMuscles,
              instructions: workout.instructions,
              latestInstructions: workout.latest_instructions,
              isPublic: true, // Set based on your requirements
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .returning();

          // Insert primary muscle activations
          const primaryMuscleValues =
            workout.muscleActivation.primary_muscle.map((muscle) => ({
              workoutId: insertedWorkout.id,
              muscleCode: muscle.code,
              isPrimary: true,
              activation: muscle.activation,
            }));

          // Insert secondary muscle activations
          const secondaryMuscleValues =
            workout.muscleActivation.secondary_muscle.map((muscle) => ({
              workoutId: insertedWorkout.id,
              muscleCode: muscle.code,
              isPrimary: false,
              activation: muscle.activation,
            }));

          // Insert all muscle activations
          await tx
            .insert(workoutMuscleActivations)
            .values([...primaryMuscleValues, ...secondaryMuscleValues]);

          insertedWorkouts.push(insertedWorkout);
        }

        return insertedWorkouts;
      });

      return c.json({
        message: "Workouts created successfully",
        count: result.length,
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new HTTPException(400, {
          message: `Invalid payload format: ${error.errors.map((e) => e.message).join(", ")}`,
        });
      }

      console.error(error);
      throw new HTTPException(500, {
        message: "Failed to create workouts in bulk",
      });
    }
  }
}
