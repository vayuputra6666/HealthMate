import { MongoStorage } from "./mongo-storage.js";

export interface IStorage {
  connect(): Promise<void>;
  getExercises(): Promise<any[]>;
  createExercise(exercise: any): Promise<any>;
  getWorkouts(): Promise<any[]>;
  createWorkout(workout: any): Promise<any>;
  getMealsByDate(date: Date): Promise<any[]>;
  createMeal(meal: any): Promise<any>;
  getNutritionGoals(): Promise<any[]>;
  createNutritionGoal(goal: any): Promise<any>;

  // Additional methods used by routes
  getAllExercises(): Promise<any[]>;
  getExerciseById(id: number): Promise<any>;
  getAllWorkouts(): Promise<any[]>;
  getRecentWorkouts(): Promise<any[]>;
  getAllMeals(): Promise<any[]>;
  createRecipe(recipe: any): Promise<any>;
  getAllRecipes(): Promise<any[]>;
  getAllNutritionGoals(): Promise<any[]>;
  createChallenge(challenge: any): Promise<any>;
  getAllChallenges(): Promise<any[]>;
  createWeightEntry(weightEntry: any): Promise<any>;
  getWeightEntries(): Promise<any[]>;
  getLatestWeight(): Promise<any>;
}

let storage: IStorage | null = null;

async function initializeStorage(): Promise<IStorage> {
  if (process.env.USE_MONGODB === 'true') {
    const mongoStorage = new MongoStorage();
    await mongoStorage.connect();
    return mongoStorage;
  } else {
    // Fallback to in-memory storage for development
    return new InMemoryStorage();
  }
}

class InMemoryStorage implements IStorage {
  private exercises: any[] = [];
  private workouts: any[] = [];
  private meals: any[] = [];
  private nutritionGoals: any[] = [];
  private recipes: any[] = [];
  private weightEntries: any[] = [];
  private challenges: any[] = [];

  async connect(): Promise<void> {
    console.log("Storage: In-memory storage connected");

    // Initialize with sample exercises if empty
    if (this.exercises.length === 0) {
      this.exercises = [
        {
          id: "1",
          name: "Push-ups",
          category: "chest",
          instructions: "Lower your body until your chest nearly touches the floor, then push back up.",
          difficulty: "beginner",
          muscleGroups: ["chest", "shoulders", "triceps"],
          equipment: ["bodyweight"]
        },
        {
          id: "2", 
          name: "Squats",
          category: "legs",
          instructions: "Lower your body by bending your knees until your thighs are parallel to the floor.",
          difficulty: "beginner",
          muscleGroups: ["quadriceps", "glutes", "hamstrings"],
          equipment: ["bodyweight"]
        },
        {
          id: "3",
          name: "Pull-ups", 
          category: "back",
          instructions: "Hang from a bar and pull your body up until your chin is above the bar.",
          difficulty: "intermediate",
          muscleGroups: ["back", "biceps"],
          equipment: ["pull-up bar"]
        }
      ];
      console.log("Storage: Initialized with sample exercises");
    }
  }

  async getExercises(): Promise<any[]> {
    return this.exercises;
  }

  async getAllExercises(): Promise<any[]> {
    return this.exercises;
  }

  async getExerciseById(id: number): Promise<any> {
    return this.exercises.find(exercise => exercise.id === id.toString());
  }

  async createExercise(exercise: any): Promise<any> {
    const newExercise = { ...exercise, id: Date.now().toString() };
    this.exercises.push(newExercise);
    return newExercise;
  }

  async getWorkouts(): Promise<any[]> {
    return this.workouts;
  }

  async getAllWorkouts(): Promise<any[]> {
    return this.workouts;
  }

  async getRecentWorkouts(): Promise<any[]> {
    return this.workouts.slice(-5);
  }

  async createWorkout(workout: any): Promise<any> {
    const newWorkout = { ...workout, id: Date.now().toString() };
    this.workouts.push(newWorkout);
    return newWorkout;
  }

  async getMealsByDate(date: Date): Promise<any[]> {
    const dateStr = date.toISOString().split('T')[0];
    return this.meals.filter(meal => meal.date?.startsWith(dateStr));
  }

  async getAllMeals(): Promise<any[]> {
    return this.meals;
  }

  async createMeal(meal: any): Promise<any> {
    const newMeal = { ...meal, id: Date.now().toString() };
    this.meals.push(newMeal);
    return newMeal;
  }

  async createRecipe(recipe: any): Promise<any> {
    const newRecipe = { ...recipe, id: Date.now().toString() };
    this.recipes.push(newRecipe);
    return newRecipe;
  }

  async getAllRecipes(): Promise<any[]> {
    return this.recipes;
  }

  async getNutritionGoals(): Promise<any[]> {
    return this.nutritionGoals;
  }

  async getAllNutritionGoals(): Promise<any[]> {
    return this.nutritionGoals;
  }

  async createNutritionGoal(goal: any): Promise<any> {
    const newGoal = { ...goal, id: Date.now().toString() };
    this.nutritionGoals.push(newGoal);
    return newGoal;
  }

  async createChallenge(challenge: any): Promise<any> {
    const newChallenge = { ...challenge, id: Date.now().toString() };
    this.challenges.push(newChallenge);
    return newChallenge;
  }

  async getAllChallenges(): Promise<any[]> {
    return this.challenges;
  }

  async createWeightEntry(weightEntry: any): Promise<any> {
    const newWeightEntry = { ...weightEntry, id: Date.now().toString() };
    this.weightEntries.push(newWeightEntry);
    return newWeightEntry;
  }

  async getWeightEntries(): Promise<any[]> {
    return this.weightEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getLatestWeight(): Promise<any> {
    if (this.weightEntries.length === 0) return null;
    return this.weightEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }

  // Additional methods required by routes
  async getAllExercises(): Promise<any[]> {
    return this.exercises;
  }

  async getExerciseById(id: number): Promise<any> {
    return this.exercises.find(exercise => exercise.id === id.toString()) || null;
  }

  async getAllWorkouts(): Promise<any[]> {
    return this.workouts;
  }

  async getRecentWorkouts(): Promise<any[]> {
    return this.workouts.slice(-5);
  }

  async getAllMeals(): Promise<any[]> {
    return this.meals;
  }

  async createRecipe(recipe: any): Promise<any> {
    const newRecipe = { ...recipe, id: Date.now().toString() };
    this.recipes = this.recipes || [];
    this.recipes.push(newRecipe);
    return newRecipe;
  }

  async getAllRecipes(): Promise<any[]> {
    return this.recipes || [];
  }

  async getAllNutritionGoals(): Promise<any[]> {
    return this.nutritionGoals;
  }

  async createChallenge(challenge: any): Promise<any> {
    const newChallenge = { ...challenge, id: Date.now().toString() };
    this.challenges = this.challenges || [];
    this.challenges.push(newChallenge);
    return newChallenge;
  }

  async getAllChallenges(): Promise<any[]> {
    return this.challenges || [];
  }

  async createWeightEntry(weightEntry: any): Promise<any> {
    const newEntry = { ...weightEntry, id: Date.now().toString() };
    this.weightEntries = this.weightEntries || [];
    this.weightEntries.push(newEntry);
    return newEntry;
  }

  async getWeightEntries(): Promise<any[]> {
    return this.weightEntries || [];
  }

  async getLatestWeight(): Promise<any> {
    const entries = this.weightEntries || [];
    return entries.length > 0 ? entries[entries.length - 1] : null;
  }
}

class MongoStorage implements IStorage {
  private db: any;
  private connected: boolean = false;
  private exercises: any[] = [];
  private workouts: any[] = [];
  private meals: any[] = [];
  private nutritionGoals: any[] = [];
  private recipes: any[] = [];
  private weightEntries: any[] = [];
  private challenges: any[] = [];

  async connect(): Promise<void> {
    console.log("Storage: In-memory storage connected");
    this.connected = true;

    // Initialize with sample exercises if empty
    if (this.exercises.length === 0) {
      this.exercises = [
        {
          id: "1",
          name: "Push-ups",
          category: "chest",
          instructions: "Lower your body until your chest nearly touches the floor, then push back up.",
          difficulty: "beginner",
          muscleGroups: ["chest", "shoulders", "triceps"],
          equipment: ["bodyweight"]
        },
        {
          id: "2", 
          name: "Squats",
          category: "legs",
          instructions: "Lower your body by bending your knees until your thighs are parallel to the floor.",
          difficulty: "beginner",
          muscleGroups: ["quadriceps", "glutes", "hamstrings"],
          equipment: ["bodyweight"]
        },
        {
          id: "3",
          name: "Pull-ups", 
          category: "back",
          instructions: "Hang from a bar and pull your body up until your chin is above the bar.",
          difficulty: "intermediate",
          muscleGroups: ["back", "biceps"],
          equipment: ["pull-up bar"]
        }
      ];
      console.log("Storage: Initialized with sample exercises");
    }
  }

  async getExercises(): Promise<any[]> {
    return this.exercises;
  }

  async getAllExercises(): Promise<any[]> {
    return this.exercises;
  }

  async getExerciseById(id: number): Promise<any> {
    return this.exercises.find(exercise => exercise.id === id.toString());
  }

  async createExercise(exercise: any): Promise<any> {
    const newExercise = { ...exercise, id: Date.now().toString() };
    this.exercises.push(newExercise);
    return newExercise;
  }

  async getWorkouts(): Promise<any[]> {
    return this.workouts;
  }

  async getAllWorkouts(): Promise<any[]> {
    return this.workouts;
  }

  async getRecentWorkouts(): Promise<any[]> {
    return this.workouts.slice(-5);
  }

  async createWorkout(workout: any): Promise<any> {
    const newWorkout = { ...workout, id: Date.now().toString() };
    this.workouts.push(newWorkout);
    return newWorkout;
  }

  async getMealsByDate(date: Date): Promise<any[]> {
    const dateStr = date.toISOString().split('T')[0];
    return this.meals.filter(meal => meal.date?.startsWith(dateStr));
  }

  async getAllMeals(): Promise<any[]> {
    return this.meals;
  }

  async createMeal(meal: any): Promise<any> {
    const newMeal = { ...meal, id: Date.now().toString() };
    this.meals.push(newMeal);
    return newMeal;
  }

  async createRecipe(recipe: any): Promise<any> {
    const newRecipe = { ...recipe, id: Date.now().toString() };
    this.recipes.push(newRecipe);
    return newRecipe;
  }

  async getAllRecipes(): Promise<any[]> {
    return this.recipes;
  }

  async getNutritionGoals(): Promise<any[]> {
    return this.nutritionGoals;
  }

  async getAllNutritionGoals(): Promise<any[]> {
    return this.nutritionGoals;
  }

  async createNutritionGoal(goal: any): Promise<any> {
    const newGoal = { ...goal, id: Date.now().toString() };
    this.nutritionGoals.push(newGoal);
    return newGoal;
  }

  async createChallenge(challenge: any): Promise<any> {
    const newChallenge = { ...challenge, id: Date.now().toString() };
    this.challenges.push(newChallenge);
    return newChallenge;
  }

  async getAllChallenges(): Promise<any[]> {
    return this.challenges;
  }

  async createWeightEntry(weightEntry: any): Promise<any> {
    const newWeightEntry = { ...weightEntry, id: Date.now().toString() };
    this.weightEntries.push(newWeightEntry);
    return newWeightEntry;
  }

  async getWeightEntries(): Promise<any[]> {
    return this.weightEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getLatestWeight(): Promise<any> {
    if (this.weightEntries.length === 0) return null;
    return this.weightEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }
}

let storage: IStorage | null = null;

export async function getStorage(): Promise<IStorage> {
  if (!storage) {
    // Use MongoDB storage
    storage = new MongoStorage();
    await storage.connect();
  }
  return storage;
}