import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., "chest", "legs", "back", etc.
  instructions: text("instructions"),
  muscleGroups: text("muscle_groups").array(), // muscles targeted by this exercise
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration"), // in minutes
  notes: text("notes"),
  gender: text("gender", { enum: ["male", "female"] }).default("male"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").notNull(),
  exerciseId: integer("exercise_id").notNull(),
  orderIndex: integer("order_index").notNull(),
});

export const sets = pgTable("sets", {
  id: serial("id").primaryKey(),
  workoutExerciseId: integer("workout_exercise_id").notNull(),
  setNumber: integer("set_number").notNull(),
  weight: decimal("weight", { precision: 6, scale: 2 }), // in lbs
  reps: integer("reps"),
  completed: integer("completed").default(1), // 1 for completed, 0 for not
});

// Insert schemas
export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
}).extend({
  muscleGroups: z.array(z.string()).optional(),
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
});

export const insertWorkoutExerciseSchema = createInsertSchema(workoutExercises).omit({
  id: true,
});

export const insertSetSchema = createInsertSchema(sets).omit({
  id: true,
});

// Extended schemas for creating workouts with exercises
export const createWorkoutSchema = insertWorkoutSchema.extend({
  gender: z.enum(["male", "female"]).optional(),
  exercises: z.array(z.object({
    exerciseId: z.number(),
    sets: z.array(z.object({
      weight: z.string().optional(),
      reps: z.number().optional(),
    })),
  })),
});

// Types
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>;

export type Set = typeof sets.$inferSelect;
export type InsertSet = z.infer<typeof insertSetSchema>;

export type CreateWorkout = z.infer<typeof createWorkoutSchema>;

// Nutrition tables
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["breakfast", "lunch", "dinner", "snack"] }).notNull(),
  date: timestamp("date").notNull(),
  calories: integer("calories"),
  protein: decimal("protein", { precision: 6, scale: 2 }), // in grams
  carbs: decimal("carbs", { precision: 6, scale: 2 }), // in grams
  fat: decimal("fat", { precision: 6, scale: 2 }), // in grams
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  instructions: text("instructions").notNull(),
  servings: integer("servings").default(1),
  prepTime: integer("prep_time"), // in minutes
  cookTime: integer("cook_time"), // in minutes
  calories: integer("calories"),
  protein: decimal("protein", { precision: 6, scale: 2 }),
  carbs: decimal("carbs", { precision: 6, scale: 2 }),
  fat: decimal("fat", { precision: 6, scale: 2 }),
  ingredients: text("ingredients").array(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const nutritionGoals = pgTable("nutrition_goals", {
  id: serial("id").primaryKey(),
  dailyCalories: integer("daily_calories").notNull(),
  dailyProtein: decimal("daily_protein", { precision: 6, scale: 2 }).notNull(),
  dailyCarbs: decimal("daily_carbs", { precision: 6, scale: 2 }).notNull(),
  dailyFat: decimal("daily_fat", { precision: 6, scale: 2 }).notNull(),
  maintenanceCalories: integer("maintenance_calories"),
  weightGoal: text("weight_goal", { enum: ["lose", "maintain", "gain"] }).default("maintain"),
  activityLevel: text("activity_level", { enum: ["sedentary", "light", "moderate", "active", "very_active"] }).default("moderate"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const weightEntries = pgTable("weight_entries", {
  id: serial("id").primaryKey(),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(), // in lbs or kg
  unit: text("unit", { enum: ["lbs", "kg"] }).default("lbs"),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProfile = pgTable("user_profile", {
  id: serial("id").primaryKey(),
  height: decimal("height", { precision: 5, scale: 2 }), // in inches or cm
  heightUnit: text("height_unit", { enum: ["inches", "cm"] }).default("inches"),
  age: integer("age"),
  gender: text("gender", { enum: ["male", "female"] }).default("male"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Motivational content tables
export const motivationalQuotes = pgTable("motivational_quotes", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  author: text("author"),
  category: text("category", { enum: ["motivation", "fitness", "nutrition", "mindset"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyChallenges = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["workout", "nutrition", "mindset", "habit"] }).notNull(),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull(),
  points: integer("points").default(10),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertMealSchema = createInsertSchema(meals).omit({
  id: true,
  createdAt: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
}).extend({
  ingredients: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const insertNutritionGoalSchema = createInsertSchema(nutritionGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWeightEntrySchema = createInsertSchema(weightEntries).omit({
  id: true,
  createdAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfile).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMotivationalQuoteSchema = createInsertSchema(motivationalQuotes).omit({
  id: true,
  createdAt: true,
});

export const insertDailyChallengeSchema = createInsertSchema(dailyChallenges).omit({
  id: true,
  createdAt: true,
});

// Types
export type Meal = typeof meals.$inferSelect;
export type InsertMeal = z.infer<typeof insertMealSchema>;

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

export type NutritionGoal = typeof nutritionGoals.$inferSelect;
export type InsertNutritionGoal = z.infer<typeof insertNutritionGoalSchema>;

export type WeightEntry = typeof weightEntries.$inferSelect;
export type InsertWeightEntry = z.infer<typeof insertWeightEntrySchema>;

export type UserProfile = typeof userProfile.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type MotivationalQuote = typeof motivationalQuotes.$inferSelect;
export type InsertMotivationalQuote = z.infer<typeof insertMotivationalQuoteSchema>;

export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type InsertDailyChallenge = z.infer<typeof insertDailyChallengeSchema>;

// Extended types for API responses
export type WorkoutWithExercises = Workout & {
  exercises: (WorkoutExercise & {
    exercise: Exercise;
    sets: Set[];
  })[];
};
