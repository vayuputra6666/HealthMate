
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
  private connected: boolean = false;

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
    if (!this.connected) {
      await this.client.connect();
      console.log("Connected to MongoDB");
      await this.db.admin().ping();
      console.log("MongoDB ping successful");
      this.connected = true;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.close();
      this.connected = false;
    }
  }

  // Helper methods for mapping MongoDB data
  private mapCategory(muscleGroup: any): string {
    if (!muscleGroup) return "general";
    
    let primaryMuscle = "";
    if (Array.isArray(muscleGroup)) {
      primaryMuscle = muscleGroup[0]?.toLowerCase() || "";
    } else {
      primaryMuscle = muscleGroup.toString().toLowerCase();
    }
    
    // Map common muscle groups to categories based on your MongoDB data
    if (primaryMuscle.includes('chest') || primaryMuscle.includes('pectoral')) return 'chest';
    if (primaryMuscle.includes('back') || primaryMuscle.includes('lats') || primaryMuscle.includes('rhomboids') || primaryMuscle.includes('trap')) return 'back';
    if (primaryMuscle.includes('shoulder') || primaryMuscle.includes('deltoid')) return 'shoulders';
    if (primaryMuscle.includes('bicep') || primaryMuscle.includes('tricep') || primaryMuscle.includes('forearm')) return 'arms';
    if (primaryMuscle.includes('quad') || primaryMuscle.includes('hamstring') || primaryMuscle.includes('glute') || primaryMuscle.includes('calf')) return 'legs';
    if (primaryMuscle.includes('abs') || primaryMuscle.includes('core') || primaryMuscle.includes('oblique')) return 'core';
    if (primaryMuscle.includes('cardio') || primaryMuscle.includes('aerobic')) return 'cardio';
    
    return 'general';
  }

  private mapDifficulty(difficultyLevel: any): string {
    if (!difficultyLevel) return "beginner";
    
    const difficulty = difficultyLevel.toString().toLowerCase();
    
    if (difficulty.includes('advanced') || difficulty.includes('expert') || difficulty.includes('hard')) return 'advanced';
    if (difficulty.includes('intermediate') || difficulty.includes('medium')) return 'intermediate';
    
    return 'beginner';
  }

  async getAllExercises(): Promise<any[]> {
    try {
      console.log("Fetching exercises from MongoDB...");
      
      // Ensure connection
      await this.connect();
      
      if (!this.exercises) {
        console.error("Exercises collection not initialized");
        return [];
      }
      
      const mongoExercises = await this.exercises.find({}).toArray();
      console.log("Raw MongoDB exercises count:", mongoExercises?.length || 0);
      
      if (!mongoExercises || mongoExercises.length === 0) {
        console.log("No exercises found in MongoDB");
        return [];
      }
      
      // Map MongoDB fields to expected frontend format
      const mappedExercises = mongoExercises.map(exercise => {
        const mapped = {
          id: exercise._id?.toString() || Math.random().toString(),
          name: exercise.exercise_name || exercise.name || "Unknown Exercise",
          category: this.mapCategory(exercise.muscle_group) || "general",
          instructions: exercise.primary_function || exercise.instructions || "No instructions available",
          difficulty: this.mapDifficulty(exercise.difficulty_level) || "beginner",
          equipment: Array.isArray(exercise.equipment) ? exercise.equipment : (exercise.equipment ? [exercise.equipment] : []),
          muscleGroups: Array.isArray(exercise.muscle_group) ? exercise.muscle_group : (exercise.muscle_group ? [exercise.muscle_group] : [])
        };
        console.log(`Mapped exercise: ${mapped.name} -> category: ${mapped.category}, difficulty: ${mapped.difficulty}`);
        return mapped;
      });
      
      console.log("Mapped exercises count:", mappedExercises.length);
      return mappedExercises;
    } catch (error) {
      console.error("Error fetching exercises from MongoDB:", error);
      return [];
    }
  }

  async getExercises(): Promise<any[]> {
    return await this.getAllExercises();
  }

  async createExercise(exercise: any): Promise<any> {
    await this.connect();
    const result = await this.exercises.insertOne(exercise);
    return { ...exercise, _id: result.insertedId };
  }

  async getExerciseById(id: number): Promise<any> {
    await this.connect();
    const { ObjectId } = await import('mongodb');
    
    try {
      // Try to find by _id if it's a valid ObjectId
      const exercise = await this.exercises.findOne({ _id: new ObjectId(id.toString()) });
      
      if (exercise) {
        return {
          id: exercise._id.toString(),
          name: exercise.exercise_name || exercise.name,
          category: this.mapCategory(exercise.muscle_group),
          instructions: exercise.primary_function || exercise.instructions || "No instructions available",
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

  async getWorkouts(): Promise<any[]> {
    await this.connect();
    return await this.workouts.find({}).toArray();
  }

  async getAllWorkouts(): Promise<any[]> {
    return await this.getWorkouts();
  }

  async createWorkout(workout: any): Promise<any> {
    await this.connect();
    const result = await this.workouts.insertOne(workout);
    return { ...workout, _id: result.insertedId };
  }

  async getRecentWorkouts(): Promise<any[]> {
    await this.connect();
    return await this.workouts.find({}).sort({ date: -1 }).limit(5).toArray();
  }

  async getMealsByDate(date: Date): Promise<any[]> {
    await this.connect();
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

  async getAllMeals(): Promise<any[]> {
    await this.connect();
    return await this.meals.find({}).toArray();
  }

  async createMeal(meal: any): Promise<any> {
    await this.connect();
    const result = await this.meals.insertOne(meal);
    return { ...meal, _id: result.insertedId };
  }

  async getNutritionGoals(): Promise<any[]> {
    await this.connect();
    return await this.nutritionGoals.find({}).toArray();
  }

  async getAllNutritionGoals(): Promise<any[]> {
    return await this.getNutritionGoals();
  }

  async createNutritionGoal(goal: any): Promise<any> {
    await this.connect();
    const result = await this.nutritionGoals.insertOne(goal);
    return { ...goal, _id: result.insertedId };
  }

  async createRecipe(recipe: any): Promise<any> {
    await this.connect();
    const result = await this.recipes.insertOne(recipe);
    return { ...recipe, _id: result.insertedId };
  }

  async getAllRecipes(): Promise<any[]> {
    await this.connect();
    return await this.recipes.find({}).toArray();
  }

  async createChallenge(challenge: any): Promise<any> {
    await this.connect();
    const result = await this.challenges.insertOne(challenge);
    return { ...challenge, _id: result.insertedId };
  }

  async getAllChallenges(): Promise<any[]> {
    await this.connect();
    return await this.challenges.find({}).toArray();
  }

  async createWeightEntry(weightEntry: any): Promise<any> {
    await this.connect();
    const result = await this.weightEntries.insertOne(weightEntry);
    return { ...weightEntry, _id: result.insertedId };
  }

  async getWeightEntries(): Promise<any[]> {
    await this.connect();
    return await this.weightEntries.find({}).sort({ date: -1 }).toArray();
  }

  async getLatestWeight(): Promise<any> {
    await this.connect();
    return await this.weightEntries.findOne({}, { sort: { date: -1 } });
  }
}
