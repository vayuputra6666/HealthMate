import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  createWorkoutSchema, 
  insertExerciseSchema, 
  insertMealSchema, 
  insertRecipeSchema, 
  insertNutritionGoalSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Exercise routes
  app.get("/api/exercises", async (req, res) => {
    try {
      const exercises = await storage.getAllExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

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

  // Workout routes
  app.get("/api/workouts", async (req, res) => {
    try {
      // Get all workouts with their exercise details
      const workouts = await storage.getAllWorkouts();
      const detailedWorkouts = await Promise.all(
        workouts.map(async (workout) => {
          const detailedWorkout = await storage.getWorkoutById(workout.id);
          return detailedWorkout;
        })
      );
      res.json(detailedWorkouts.filter(w => w !== undefined));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.get("/api/workouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workout ID" });
      }

      const workout = await storage.getWorkoutById(id);
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }

      res.json(workout);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout" });
    }
  });

  app.post("/api/workouts", async (req, res) => {
    try {
      const workoutData = createWorkoutSchema.parse(req.body);
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

  app.delete("/api/workouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workout ID" });
      }

      const deleted = await storage.deleteWorkout(id);
      if (!deleted) {
        return res.status(404).json({ message: "Workout not found" });
      }

      res.json({ message: "Workout deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete workout" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getWorkoutStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Nutrition routes
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

  app.get("/api/meals/:date", async (req, res) => {
    try {
      const date = new Date(req.params.date);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      const meals = await storage.getMealsByDate(date);
      res.json(meals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meals" });
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

  app.get("/api/nutrition-goals", async (req, res) => {
    try {
      const goals = await storage.getNutritionGoals();
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nutrition goals" });
    }
  });

  app.post("/api/nutrition-goals", async (req, res) => {
    try {
      const goalsData = insertNutritionGoalSchema.parse(req.body);
      const goals = await storage.updateNutritionGoals(goalsData);
      res.status(201).json(goals);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid nutrition goals data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update nutrition goals" });
      }
    }
  });

  // Motivational content routes
  app.get("/api/motivation/quote", async (req, res) => {
    try {
      const category = req.query.category as string;
      let quote;
      
      if (category) {
        const quotes = await storage.getQuotesByCategory(category);
        quote = quotes[0];
      } else {
        quote = await storage.getRandomQuote();
      }
      
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch motivational quote" });
    }
  });

  app.get("/api/motivation/challenge", async (req, res) => {
    try {
      const challenge = await storage.getTodaysChallenge();
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily challenge" });
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

  const httpServer = createServer(app);
  return httpServer;
}
