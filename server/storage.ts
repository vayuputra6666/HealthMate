import {
  exercises,
  workouts,
  workoutExercises,
  sets,
  meals,
  recipes,
  nutritionGoals,
  motivationalQuotes,
  dailyChallenges,
  type Exercise,
  type InsertExercise,
  type Workout,
  type InsertWorkout,
  type WorkoutExercise,
  type InsertWorkoutExercise,
  type Set,
  type InsertSet,
  type CreateWorkout,
  type WorkoutWithExercises,
  type Meal,
  type InsertMeal,
  type Recipe,
  type InsertRecipe,
  type NutritionGoal,
  type InsertNutritionGoal,
  type MotivationalQuote,
  type InsertMotivationalQuote,
  type DailyChallenge,
  type InsertDailyChallenge
} from "@shared/schema";
import { eq, sql, desc, and } from "drizzle-orm";

export interface IStorage {
  // Exercise methods
  getAllExercises(): Promise<Exercise[]>;
  getExerciseById(id: number): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;

  // Workout methods
  getAllWorkouts(): Promise<Workout[]>;
  getWorkoutById(id: number): Promise<WorkoutWithExercises | undefined>;
  createWorkout(workout: CreateWorkout): Promise<WorkoutWithExercises>;
  updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined>;
  deleteWorkout(id: number): Promise<boolean>;

  // Stats methods
  getWorkoutStats(): Promise<{
    weeklyWorkouts: number;
    totalWeight: number;
    avgDuration: number;
  }>;

   // Nutrition methods
   createMeal(meal: InsertMeal): Promise<Meal>;
   getMealsByDate(date: Date): Promise<Meal[]>;
   getAllRecipes(): Promise<Recipe[]>;
   createRecipe(recipe: InsertRecipe): Promise<Recipe>;
   getNutritionGoals(): Promise<NutritionGoal | undefined>;
   updateNutritionGoals(goals: InsertNutritionGoal): Promise<NutritionGoal>;
 
   // Motivational content methods
   getRandomQuote(): Promise<MotivationalQuote | undefined>;
   getQuotesByCategory(category: string): Promise<MotivationalQuote[]>;
   getTodaysChallenge(): Promise<DailyChallenge | undefined>;
   getAllChallenges(): Promise<DailyChallenge[]>;
}

export class MemStorage implements IStorage {
  private exercises: Map<number, Exercise>;
  private workouts: Map<number, Workout>;
  private workoutExercises: Map<number, WorkoutExercise>;
  private sets: Map<number, Set>;
  private meals: Map<number, Meal>;
  private recipes: Map<number, Recipe>;
  private nutritionGoals: NutritionGoal | undefined;
  private motivationalQuotes: Map<number, MotivationalQuote>;
  private dailyChallenges: Map<number, DailyChallenge>;
  private currentExerciseId: number;
  private currentWorkoutId: number;
  private currentWorkoutExerciseId: number;
  private currentSetId: number;
  private currentMealId: number;
  private currentRecipeId: number;
  private currentQuoteId: number;
  private currentChallengeId: number;

  constructor() {
    this.exercises = new Map();
    this.workouts = new Map();
    this.workoutExercises = new Map();
    this.sets = new Map();
    this.meals = new Map();
    this.recipes = new Map();
    this.nutritionGoals = undefined;
    this.motivationalQuotes = new Map();
    this.dailyChallenges = new Map();
    this.currentExerciseId = 1;
    this.currentWorkoutId = 1;
    this.currentWorkoutExerciseId = 1;
    this.currentSetId = 1;
    this.currentMealId = 1;
    this.currentRecipeId = 1;
    this.currentQuoteId = 1;
    this.currentChallengeId = 1;

    // Initialize with some common exercises
    this.initializeExercises();
    this.initializeRecipes();
    this.initializeMotivationalQuotes();
    this.initializeDailyChallenges();
  }

  private initializeExercises() {
    const commonExercises = [
      { 
        name: "Bench Press", 
        category: "chest", 
        instructions: "Lie on bench, lower bar to chest, press up",
        muscleGroups: ["chest", "triceps", "shoulders"]
      },
      { 
        name: "Squats", 
        category: "legs", 
        instructions: "Stand with feet shoulder-width apart, squat down, stand up",
        muscleGroups: ["quadriceps", "glutes", "hamstrings", "calves"]
      },
      { 
        name: "Deadlift", 
        category: "back", 
        instructions: "Stand over bar, grip with both hands, lift with legs and back",
        muscleGroups: ["hamstrings", "glutes", "erector_spinae", "traps", "lats"]
      },
      { 
        name: "Pull-ups", 
        category: "back", 
        instructions: "Hang from bar, pull body up until chin over bar",
        muscleGroups: ["lats", "rhomboids", "biceps", "traps"]
      },
      { 
        name: "Overhead Press", 
        category: "shoulders", 
        instructions: "Press weight overhead from shoulder height",
        muscleGroups: ["shoulders", "triceps", "traps"]
      },
      { 
        name: "Rows", 
        category: "back", 
        instructions: "Pull weight towards torso while bent over",
        muscleGroups: ["lats", "rhomboids", "traps", "biceps"]
      },
      { 
        name: "Dips", 
        category: "chest", 
        instructions: "Lower body between parallel bars, push back up",
        muscleGroups: ["chest", "triceps", "shoulders"]
      },
      { 
        name: "Leg Press", 
        category: "legs", 
        instructions: "Push weight away with legs while seated",
        muscleGroups: ["quadriceps", "glutes", "hamstrings"]
      },
      { 
        name: "Bicep Curls", 
        category: "arms", 
        instructions: "Curl weight up towards shoulders",
        muscleGroups: ["biceps"]
      },
      { 
        name: "Tricep Extensions", 
        category: "arms", 
        instructions: "Extend weight overhead or behind head",
        muscleGroups: ["triceps"]
      },
    ];

    commonExercises.forEach(exercise => {
      const id = this.currentExerciseId++;
      this.exercises.set(id, { ...exercise, id });
    });
  }

  private initializeRecipes() {
    const commonRecipes = [
      {
        name: "Protein Power Bowl",
        description: "High-protein breakfast bowl perfect for muscle building",
        instructions: "1. Cook quinoa according to package instructions\n2. Scramble eggs with spinach\n3. Add Greek yogurt and berries\n4. Top with nuts and seeds",
        servings: 1,
        prepTime: 15,
        cookTime: 10,
        calories: 520,
        protein: "35.5",
        carbs: "45.2",
        fat: "18.3",
        ingredients: ["1 cup cooked quinoa", "2 eggs", "1/2 cup Greek yogurt", "1 cup spinach", "1/2 cup berries", "2 tbsp nuts"],
        tags: ["high-protein", "breakfast", "muscle-building"]
      },
      {
        name: "Post-Workout Smoothie",
        description: "Perfect recovery smoothie with optimal protein-carb ratio",
        instructions: "1. Add all ingredients to blender\n2. Blend until smooth\n3. Serve immediately",
        servings: 1,
        prepTime: 5,
        cookTime: 0,
        calories: 380,
        protein: "28.0",
        carbs: "52.0",
        fat: "8.5",
        ingredients: ["1 scoop protein powder", "1 banana", "1 cup almond milk", "1 tbsp peanut butter", "1 cup ice"],
        tags: ["post-workout", "smoothie", "recovery"]
      },
      {
        name: "Lean Chicken & Rice",
        description: "Classic bodybuilding meal for clean bulk",
        instructions: "1. Season and grill chicken breast\n2. Cook brown rice\n3. Steam broccoli\n4. Serve with a drizzle of olive oil",
        servings: 1,
        prepTime: 10,
        cookTime: 25,
        calories: 450,
        protein: "42.0",
        carbs: "38.0",
        fat: "12.0",
        ingredients: ["6 oz chicken breast", "1/2 cup brown rice", "1 cup broccoli", "1 tbsp olive oil"],
        tags: ["lunch", "dinner", "lean", "muscle-building"]
      }
    ];

    commonRecipes.forEach(recipe => {
      const id = this.currentRecipeId++;
      this.recipes.set(id, { ...recipe, id });
    });
  }

  private initializeMotivationalQuotes() {
    const quotes = [
      {
        quote: "The body achieves what the mind believes.",
        author: "Napoleon Hill",
        category: "motivation"
      },
      {
        quote: "Champions train, losers complain.",
        author: "Unknown",
        category: "fitness"
      },
      {
        quote: "Your body can do it. It's your mind you need to convince.",
        author: "Unknown",
        category: "mindset"
      },
      {
        quote: "Success isn't given. It's earned in the gym.",
        author: "Unknown",
        category: "fitness"
      },
      {
        quote: "Abs are made in the kitchen, not the gym.",
        author: "Unknown",
        category: "nutrition"
      },
      {
        quote: "The groundwork for all happiness is good health.",
        author: "Leigh Hunt",
        category: "motivation"
      },
      {
        quote: "Discipline is choosing between what you want now and what you want most.",
        author: "Abraham Lincoln",
        category: "mindset"
      },
      {
        quote: "Don't wish for it, work for it.",
        author: "Unknown",
        category: "motivation"
      }
    ];

    quotes.forEach(quote => {
      const id = this.currentQuoteId++;
      this.motivationalQuotes.set(id, { ...quote, id });
    });
  }

  private initializeDailyChallenges() {
    const challenges = [
      {
        title: "Perfect Push-Up Day",
        description: "Complete 100 push-ups throughout the day in any rep scheme",
        type: "workout",
        difficulty: "medium",
        points: 15,
        date: new Date()
      },
      {
        title: "Hydration Hero",
        description: "Drink at least 3 liters of water today",
        type: "habit",
        difficulty: "easy",
        points: 10,
        date: new Date()
      },
      {
        title: "Protein Power",
        description: "Hit your daily protein goal without any protein supplements",
        type: "nutrition",
        difficulty: "hard",
        points: 20,
        date: new Date()
      },
      {
        title: "Mindful Meals",
        description: "Eat all meals without distractions (no TV, phone, etc.)",
        type: "mindset",
        difficulty: "medium",
        points: 15,
        date: new Date()
      }
    ];

    challenges.forEach(challenge => {
      const id = this.currentChallengeId++;
      this.dailyChallenges.set(id, { ...challenge, id });
    });
  }

  async getAllExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getExerciseById(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = this.currentExerciseId++;
    const exercise: Exercise = { 
      ...insertExercise, 
      id,
      instructions: insertExercise.instructions ?? null,
      muscleGroups: insertExercise.muscleGroups ?? null
    };
    this.exercises.set(id, exercise);
    return exercise;
  }

  async getAllWorkouts(): Promise<Workout[]> {
    return Array.from(this.workouts.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getWorkoutById(id: number): Promise<WorkoutWithExercises | undefined> {
    const workout = this.workouts.get(id);
    if (!workout) return undefined;

    const workoutExerciseList = Array.from(this.workoutExercises.values())
      .filter(we => we.workoutId === id)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    const exercises = await Promise.all(
      workoutExerciseList.map(async (we) => {
        const exercise = this.exercises.get(we.exerciseId);
        const exerciseSets = Array.from(this.sets.values())
          .filter(set => set.workoutExerciseId === we.id)
          .sort((a, b) => a.setNumber - b.setNumber);

        return {
          ...we,
          exercise: exercise!,
          sets: exerciseSets,
        };
      })
    );

    return {
      ...workout,
      exercises,
    };
  }

  async createWorkout(createWorkout: CreateWorkout): Promise<WorkoutWithExercises> {
    const workoutId = this.currentWorkoutId++;
    const workout: Workout = {
      id: workoutId,
      name: createWorkout.name,
      date: createWorkout.date,
      duration: createWorkout.duration ?? null,
      notes: createWorkout.notes ?? null,
      gender: createWorkout.gender ?? "male",
      createdAt: new Date(),
    };
    this.workouts.set(workoutId, workout);

    const exercises = [];
    for (let i = 0; i < createWorkout.exercises.length; i++) {
      const exerciseData = createWorkout.exercises[i];
      const workoutExerciseId = this.currentWorkoutExerciseId++;

      const workoutExercise: WorkoutExercise = {
        id: workoutExerciseId,
        workoutId,
        exerciseId: exerciseData.exerciseId,
        orderIndex: i,
      };
      this.workoutExercises.set(workoutExerciseId, workoutExercise);

      const exercise = this.exercises.get(exerciseData.exerciseId)!;
      const exerciseSets = [];

      for (let j = 0; j < exerciseData.sets.length; j++) {
        const setData = exerciseData.sets[j];
        const setId = this.currentSetId++;
        const set: Set = {
          id: setId,
          workoutExerciseId,
          setNumber: j + 1,
          weight: setData.weight ?? null,
          reps: setData.reps ?? null,
          completed: 1,
        };
        this.sets.set(setId, set);
        exerciseSets.push(set);
      }

      exercises.push({
        ...workoutExercise,
        exercise,
        sets: exerciseSets,
      });
    }

    return {
      ...workout,
      exercises,
    };
  }

  async updateWorkout(id: number, updateData: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const workout = this.workouts.get(id);
    if (!workout) return undefined;

    const updatedWorkout = { ...workout, ...updateData };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  async deleteWorkout(id: number): Promise<boolean> {
    const workout = this.workouts.get(id);
    if (!workout) return false;

    // Delete associated workout exercises and sets
    const workoutExerciseList = Array.from(this.workoutExercises.values())
      .filter(we => we.workoutId === id);

    for (const we of workoutExerciseList) {
      // Delete sets for this workout exercise
      const exerciseSets = Array.from(this.sets.values())
        .filter(set => set.workoutExerciseId === we.id);

      for (const set of exerciseSets) {
        this.sets.delete(set.id);
      }

      this.workoutExercises.delete(we.id);
    }

    this.workouts.delete(id);
    return true;
  }

  async getWorkoutStats(): Promise<{ weeklyWorkouts: number; totalWeight: number; avgDuration: number; }> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const allWorkouts = Array.from(this.workouts.values());
    const weeklyWorkouts = allWorkouts.filter(w => new Date(w.date) >= weekAgo).length;

    let totalWeight = 0;
    let totalDuration = 0;
    let workoutCount = 0;

    for (const workout of allWorkouts) {
      if (workout.duration) {
        totalDuration += workout.duration;
        workoutCount++;
      }

      // Calculate total weight for this workout
      const workoutExerciseList = Array.from(this.workoutExercises.values())
        .filter(we => we.workoutId === workout.id);

      for (const we of workoutExerciseList) {
        const exerciseSets = Array.from(this.sets.values())
          .filter(set => set.workoutExerciseId === we.id && set.completed === 1);

        for (const set of exerciseSets) {
          if (set.weight && set.reps) {
            totalWeight += parseFloat(set.weight) * set.reps;
          }
        }
      }
    }

    const avgDuration = workoutCount > 0 ? Math.round(totalDuration / workoutCount) : 0;

    return {
      weeklyWorkouts,
      totalWeight: Math.round(totalWeight),
      avgDuration,
    };
  }

   // Nutrition methods
   async createMeal(meal: InsertMeal): Promise<Meal> {
    const id = this.currentMealId++;
    const newMeal: Meal = { ...meal, id };
    this.meals.set(id, newMeal);
    return newMeal;
  }

  async getMealsByDate(date: Date): Promise<Meal[]> {
    const mealsForDate = Array.from(this.meals.values()).filter(meal => {
      return meal.date.toDateString() === date.toDateString();
    });
    return mealsForDate;
  }

  async getAllRecipes(): Promise<Recipe[]> {
     return Array.from(this.recipes.values());
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const id = this.currentRecipeId++;
    const newRecipe: Recipe = { ...recipe, id };
    this.recipes.set(id, newRecipe);
    return newRecipe;
  }

  async getNutritionGoals(): Promise<NutritionGoal | undefined> {
     return this.nutritionGoals;
  }

  async updateNutritionGoals(goals: InsertNutritionGoal): Promise<NutritionGoal> {
    this.nutritionGoals = { ...goals, updatedAt: new Date(), id: 1 }; // Assuming only one set of goals
    return this.nutritionGoals;
  }

  // Motivational content methods
  async getRandomQuote(): Promise<MotivationalQuote | undefined> {
    if (this.motivationalQuotes.size === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.size) + 1;
    return this.motivationalQuotes.get(randomIndex);
  }

  async getQuotesByCategory(category: string): Promise<MotivationalQuote[]> {
    const quotes = Array.from(this.motivationalQuotes.values()).filter(quote => quote.category === category);
    return quotes;
  }

  async getTodaysChallenge(): Promise<DailyChallenge | undefined> {
    const today = new Date();
    const challenge = Array.from(this.dailyChallenges.values()).find(challenge => {
      return challenge.date.toDateString() === today.toDateString();
    });
    return challenge;
  }

  async getAllChallenges(): Promise<DailyChallenge[]> {
     return Array.from(this.dailyChallenges.values());
  }
}

export const storage = new MemStorage();