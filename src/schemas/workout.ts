import { z } from "zod";
import {
  MuscleActivationSchema,
  WorkoutMuscleActivationSchema,
} from "./muscle";

export const BulkWorkoutSchema = z.object({
  bodyPart: z.string(),
  equipment: z.string(),
  description: z.string().optional(),
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  target: z.string(),
  secondaryMuscles: z.array(z.string()),
  instructions: z.array(z.string()),
  latest_instructions: z.array(z.string()),
  muscleActivation: WorkoutMuscleActivationSchema,
  youtube_link: z.union([z.string().startsWith("Error"), z.string().url()]),
});

export const UpdateWorkoutSchema = BulkWorkoutSchema.partial();
export const BulkUpdateWorkoutArraySchema = z.array(UpdateWorkoutSchema);
export const BulkWorkoutArraySchema = z.array(BulkWorkoutSchema);
