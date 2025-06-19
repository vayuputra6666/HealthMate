
import { z } from "zod";

// Exercise schemas
export const insertExerciseSchema = z.object({
  name: z.string().min(1),
  category: z.string(),
  instructions: z.string().optional(),
  difficulty: z.string().optional(),
  equipment: z.array(z.string()).optional(),
  muscleGroups: z.array(z.string()).optional()
});

// Workout schemas
export const insertWorkoutSchema = z.object({
  name: z.string().min(1),
  exercises: z.array(z.object({
    exerciseId: z.number(),
    sets: z.number(),
    reps: z.number(),
    weight: z.number().optional(),
    duration: z.number().optional()
  })),
  date: z.date().optional()
});

// Meal schemas
export const insertMealSchema = z.object({
  name: z.string().min(1),
  calories: z.number(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  date: z.date().optional()
});

// Recipe schemas
export const insertRecipeSchema = z.object({
  name: z.string().min(1),
  ingredients: z.array(z.string()),
  instructions: z.string(),
  servings: z.number(),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional()
});

// Nutrition goal schemas
export const insertNutritionGoalSchema = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  date: z.date().optional()
});

// Weight entry schemas
export const insertWeightEntrySchema = z.object({
  weight: z.number(),
  date: z.date().optional()
});

// Challenge schemas
export const insertDailyChallengeSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  type: z.string(),
  target: z.number().optional(),
  completed: z.boolean().optional(),
  date: z.date().optional()
});

// Workout creation schema for frontend
export const createWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  exercises: z.array(z.object({
    exerciseId: z.number(),
    sets: z.number().min(1),
    reps: z.number().min(1),
    weight: z.number().optional(),
    duration: z.number().optional()
  })).min(1, "At least one exercise is required")
});
