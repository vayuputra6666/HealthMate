
import { Express } from "express";
import { z } from "zod";
import { getStorage } from "./storage.js";
import {
  insertExerciseSchema,
  insertWorkoutSchema,
  insertMealSchema,
  insertRecipeSchema,
  insertNutritionGoalSchema,
  insertWeightEntrySchema,
  insertDailyChallengeSchema
} from "../shared/schema.js";

export async function registerRoutes(app: Express) {
  const storage = await getStorage();

  // Test endpoint
  app.get("/api/test", async (req, res) => {
    try {
      res.json({ 
        message: "Backend is working!", 
        timestamp: new Date().toISOString(),
        storage: storage ? "Connected" : "Not connected"
      });
    } catch (error) {
      res.status(500).json({ message: "Test failed", error: String(error) });
    }
  });

  // Exercise routes
  app.post("/api/exercises", async (req, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid exercise data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create exercise" });
      }
    }
  });

  app.get("/api/exercises", async (req, res) => {
    try {
      console.log("API: Fetching exercises from storage...");
      
      // Ensure storage is connected
      if (typeof storage.connect === 'function') {
        await storage.connect();
      }
      
      const exercises = await storage.getAllExercises();
      console.log("API: Retrieved exercises:", exercises?.length || 0, "exercises");
      
      // Ensure we return an array even if no exercises
      const result = exercises || [];
      
      // Set proper headers
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json(result);
    } catch (error) {
      console.error("API Error in /api/exercises:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      res.status(500).json({ 
        message: "Failed to fetch exercises",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/exercises/:id", async (req, res) => {
    try {
      const exercise = await storage.getExerciseById(parseInt(req.params.id));
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });

  // Workout routes
  app.post("/api/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(workoutData);
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid workout data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create workout" });
      }
    }
  });

  app.get("/api/workouts", async (req, res) => {
    try {
      const workouts = await storage.getAllWorkouts();
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.get("/api/workouts/recent", async (req, res) => {
    try {
      const recentWorkouts = await storage.getRecentWorkouts();
      res.json(recentWorkouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent workouts" });
    }
  });

  // Meal routes
  app.post("/api/meals", async (req, res) => {
    try {
      const mealData = insertMealSchema.parse(req.body);
      const meal = await storage.createMeal(mealData);
      res.status(201).json(meal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid meal data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create meal" });
      }
    }
  });

  app.get("/api/meals", async (req, res) => {
    try {
      const date = req.query.date as string;
      if (date) {
        const meals = await storage.getMealsByDate(new Date(date));
        res.json(meals);
      } else {
        const meals = await storage.getAllMeals();
        res.json(meals);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meals" });
    }
  });

  // Recipe routes
  app.post("/api/recipes", async (req, res) => {
    try {
      const recipeData = insertRecipeSchema.parse(req.body);
      const recipe = await storage.createRecipe(recipeData);
      res.status(201).json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid recipe data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create recipe" });
      }
    }
  });

  app.get("/api/recipes", async (req, res) => {
    try {
      const recipes = await storage.getAllRecipes();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Nutrition goal routes
  app.post("/api/nutrition/goals", async (req, res) => {
    try {
      const goalData = insertNutritionGoalSchema.parse(req.body);
      const goal = await storage.createNutritionGoal(goalData);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid nutrition goal data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create nutrition goal" });
      }
    }
  });

  app.get("/api/nutrition/goals", async (req, res) => {
    try {
      const goals = await storage.getAllNutritionGoals();
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nutrition goals" });
    }
  });

  // Challenge routes
  app.post("/api/motivation/challenges", async (req, res) => {
    try {
      const challengeData = insertDailyChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(challengeData);
      res.status(201).json(challenge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid challenge data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create challenge" });
      }
    }
  });

  app.get("/api/motivation/challenges", async (req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  // Weight tracking routes
  app.post("/api/weight", async (req, res) => {
    try {
      const weightData = insertWeightEntrySchema.parse(req.body);
      const weightEntry = await storage.createWeightEntry(weightData);
      res.status(201).json(weightEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid weight data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create weight entry" });
      }
    }
  });

  app.get("/api/weight", async (req, res) => {
    try {
      const weightEntries = await storage.getWeightEntries();
      res.json(weightEntries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weight entries" });
    }
  });

  app.get("/api/weight/latest", async (req, res) => {
    try {
      const latestWeight = await storage.getLatestWeight();
      res.json(latestWeight);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest weight" });
    }
  });
}
