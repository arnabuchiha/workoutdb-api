import { z } from "zod";

export const MuscleSchema = z.object({
  Code: z.string(),
  Muscle: z.string(),
  Group: z.string(),
});

export const MuscleArraySchema = z.array(MuscleSchema);

export const MuscleActivationSchema = z.object({
  code: z.string(),
  activation: z.number().min(0).max(1),
});

export const WorkoutMuscleActivationSchema = z.object({
  primary_muscle: z.array(MuscleActivationSchema),
  secondary_muscle: z.array(MuscleActivationSchema),
});
