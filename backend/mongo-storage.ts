
import { MongoClient, Db, Collection } from 'mongodb';
import { IStorage } from "./storage.js";

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private exercises: Collection;
  private workouts: Collection;
  private meals: Collection;
  private nutritionGoals: Collection;

  constructor() {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://0.0.0.0:27017';
    const dbName = process.env.MONGODB_DB_NAME || 'health_mate';

    this.client = new MongoClient(mongoUrl);
    this.db = this.client.db(dbName);
    this.exercises = this.db.collection("exercises");
    this.workouts = this.db.collection("workouts");
    this.meals = this.db.collection("meals");
    this.nutritionGoals = this.db.collection("nutrition_goals");
  }

  async connect(): Promise<void> {
    await this.client.connect();
    console.log("Connected to MongoDB");
    await this.db.admin().ping();
    console.log("MongoDB ping successful");
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async getExercises(): Promise<any[]> {
    return await this.exercises.find({}).toArray();
  }

  async createExercise(exercise: any): Promise<any> {
    const result = await this.exercises.insertOne(exercise);
    return { ...exercise, _id: result.insertedId };
  }

  async getWorkouts(): Promise<any[]> {
    return await this.workouts.find({}).toArray();
  }

  async createWorkout(workout: any): Promise<any> {
    const result = await this.workouts.insertOne(workout);
    return { ...workout, _id: result.insertedId };
  }

  async getMealsByDate(date: Date): Promise<any[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.meals.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).toArray();
  }

  async createMeal(meal: any): Promise<any> {
    const result = await this.meals.insertOne(meal);
    return { ...meal, _id: result.insertedId };
  }

  async getNutritionGoals(): Promise<any[]> {
    return await this.nutritionGoals.find({}).toArray();
  }

  async createNutritionGoal(goal: any): Promise<any> {
    const result = await this.nutritionGoals.insertOne(goal);
    return { ...goal, _id: result.insertedId };
  }
}
