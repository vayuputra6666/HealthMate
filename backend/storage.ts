
import { MongoStorage } from "./mongo-storage.js";

export interface IStorage {
  // Exercise methods
  getExercises(): Promise<any[]>;
  getAllExercises(): Promise<any[]>;
  getExerciseById(id: number): Promise<any>;
  createExercise(exercise: any): Promise<any>;
  
  // Workout methods
  getWorkouts(): Promise<any[]>;
  getAllWorkouts(): Promise<any[]>;
  getRecentWorkouts(): Promise<any[]>;
  createWorkout(workout: any): Promise<any>;
  
  // Meal methods
  getMealsByDate(date: Date): Promise<any[]>;
  getAllMeals(): Promise<any[]>;
  createMeal(meal: any): Promise<any>;
  
  // Recipe methods
  createRecipe(recipe: any): Promise<any>;
  getAllRecipes(): Promise<any[]>;
  
  // Nutrition goal methods
  getNutritionGoals(): Promise<any[]>;
  getAllNutritionGoals(): Promise<any[]>;
  createNutritionGoal(goal: any): Promise<any>;
  
  // Challenge methods
  createChallenge(challenge: any): Promise<any>;
  getAllChallenges(): Promise<any[]>;
  
  // Weight tracking methods
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

export async function getStorage(): Promise<IStorage> {
  if (!storage) {
    storage = await initializeStorage();
  }
  return storage;
}
