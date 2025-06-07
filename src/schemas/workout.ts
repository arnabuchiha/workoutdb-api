import { z } from "zod";
import {
  MuscleActivationSchema,
  WorkoutMuscleActivationSchema,
} from "./muscle";

export const BulkWorkoutSchema = z.object({
  bodyPart: z.string(),
  equipment: z.string(),
  gifUrl: z.string().url(),
  id: z.string(),
  name: z.string(),
  target: z.string(),
  secondaryMuscles: z.array(z.string()),
  instructions: z.array(z.string()),
  latest_instructions: z.array(z.string()),
  muscleActivation: WorkoutMuscleActivationSchema,
});

export const BulkWorkoutArraySchema = z.array(BulkWorkoutSchema);
