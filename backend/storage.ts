
import { MongoStorage } from "./mongo-storage.js";

export interface IStorage {
  // Exercise methods
  getExercises(): Promise<any[]>;
  createExercise(exercise: any): Promise<any>;
  
  // Workout methods
  getWorkouts(): Promise<any[]>;
  createWorkout(workout: any): Promise<any>;
  
  // Meal methods
  getMealsByDate(date: Date): Promise<any[]>;
  createMeal(meal: any): Promise<any>;
  
  // Nutrition goal methods
  getNutritionGoals(): Promise<any[]>;
  createNutritionGoal(goal: any): Promise<any>;
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

  async getExercises(): Promise<any[]> {
    return this.exercises;
  }

  async createExercise(exercise: any): Promise<any> {
    const newExercise = { ...exercise, id: Date.now().toString() };
    this.exercises.push(newExercise);
    return newExercise;
  }

  async getWorkouts(): Promise<any[]> {
    return this.workouts;
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

  async createMeal(meal: any): Promise<any> {
    const newMeal = { ...meal, id: Date.now().toString() };
    this.meals.push(newMeal);
    return newMeal;
  }

  async getNutritionGoals(): Promise<any[]> {
    return this.nutritionGoals;
  }

  async createNutritionGoal(goal: any): Promise<any> {
    const newGoal = { ...goal, id: Date.now().toString() };
    this.nutritionGoals.push(newGoal);
    return newGoal;
  }
}

export async function getStorage(): Promise<IStorage> {
  if (!storage) {
    storage = await initializeStorage();
  }
  return storage;
}
