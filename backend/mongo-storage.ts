
import { MongoClient, Db, Collection, ServerApiVersion } from 'mongodb';
import { IStorage } from "./storage.js";

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private exercises: Collection;
  private workouts: Collection;
  private meals: Collection;
  private nutritionGoals: Collection;
  private recipes: Collection;
  private weightEntries: Collection;
  private challenges: Collection;

  constructor() {
    const mongoUrl = process.env.MONGODB_URL || "mongodb+srv://vayuputra:Vayu123@cluster0.wxwtcpc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const dbName = process.env.MONGODB_DB_NAME || 'primeyouth';

    this.client = new MongoClient(mongoUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    this.db = this.client.db(dbName);
    this.exercises = this.db.collection("exercises");
    this.workouts = this.db.collection("workouts");
    this.meals = this.db.collection("meals");
    this.nutritionGoals = this.db.collection("nutrition_goals");
    this.recipes = this.db.collection("recipes");
    this.weightEntries = this.db.collection("weight_entries");
    this.challenges = this.db.collection("challenges");
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

  // Additional methods required by routes
  async getAllExercises(): Promise<any[]> {
    const mongoExercises = await this.exercises.find({}).toArray();
    
    // Map MongoDB fields to expected frontend format
    return mongoExercises.map(exercise => ({
      id: exercise._id.toString(),
      name: exercise.exercise_name,
      category: this.mapCategory(exercise.muscle_group),
      instructions: exercise.primary_function || "No instructions available",
      difficulty: this.mapDifficulty(exercise.difficulty_level),
      equipment: exercise.equipment || [],
      muscleGroups: exercise.muscle_group || []
    }));
  }

  private mapCategory(muscleGroups: string[]): string {
    if (!muscleGroups || muscleGroups.length === 0) return "general";
    
    const primaryMuscle = muscleGroups[0].toLowerCase();
    
    if (primaryMuscle.includes("quadriceps") || primaryMuscle.includes("hamstring") || primaryMuscle.includes("glute")) {
      return "legs";
    }
    if (primaryMuscle.includes("pectoral") || primaryMuscle.includes("chest")) {
      return "chest";
    }
    if (primaryMuscle.includes("back") || primaryMuscle.includes("trap")) {
      return "back";
    }
    if (primaryMuscle.includes("deltoid") || primaryMuscle.includes("shoulder")) {
      return "shoulders";
    }
    if (primaryMuscle.includes("tricep") || primaryMuscle.includes("bicep")) {
      return "arms";
    }
    
    return "general";
  }

  private mapDifficulty(difficulty: string): string {
    if (!difficulty) return "beginner";
    return difficulty.toLowerCase();
  }

  async getExerciseById(id: number): Promise<any> {
    const { ObjectId } = await import('mongodb');
    
    try {
      // Try to find by _id if it's a valid ObjectId
      const exercise = await this.exercises.findOne({ _id: new ObjectId(id.toString()) });
      
      if (exercise) {
        return {
          id: exercise._id.toString(),
          name: exercise.exercise_name,
          category: this.mapCategory(exercise.muscle_group),
          instructions: exercise.primary_function || "No instructions available",
          difficulty: this.mapDifficulty(exercise.difficulty_level),
          equipment: exercise.equipment || [],
          muscleGroups: exercise.muscle_group || []
        };
      }
      
      return null;
    } catch (error) {
      // If ObjectId conversion fails, try finding by numeric id
      return await this.exercises.findOne({ id: id });
    }
  }

  async getAllWorkouts(): Promise<any[]> {
    return await this.workouts.find({}).toArray();
  }

  async getRecentWorkouts(): Promise<any[]> {
    return await this.workouts.find({}).sort({ date: -1 }).limit(5).toArray();
  }

  async getAllMeals(): Promise<any[]> {
    return await this.meals.find({}).toArray();
  }

  async createRecipe(recipe: any): Promise<any> {
    const result = await this.recipes.insertOne(recipe);
    return { ...recipe, _id: result.insertedId };
  }

  async getAllRecipes(): Promise<any[]> {
    return await this.recipes.find({}).toArray();
  }

  async getAllNutritionGoals(): Promise<any[]> {
    return await this.nutritionGoals.find({}).toArray();
  }

  async createChallenge(challenge: any): Promise<any> {
    const result = await this.challenges.insertOne(challenge);
    return { ...challenge, _id: result.insertedId };
  }

  async getAllChallenges(): Promise<any[]> {
    return await this.challenges.find({}).toArray();
  }

  async createWeightEntry(weightEntry: any): Promise<any> {
    const result = await this.weightEntries.insertOne(weightEntry);
    return { ...weightEntry, _id: result.insertedId };
  }

  async getWeightEntries(): Promise<any[]> {
    return await this.weightEntries.find({}).sort({ date: -1 }).toArray();
  }

  async getLatestWeight(): Promise<any> {
    return await this.weightEntries.findOne({}, { sort: { date: -1 } });
  }
}
