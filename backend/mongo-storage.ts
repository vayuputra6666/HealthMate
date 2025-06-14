
import mongoose from 'mongoose';
import { IStorage } from "./storage.js";
import { 
  Exercise, Workout, Meal, Recipe, NutritionGoal, WeightEntry, Challenge,
  IExercise, IWorkout, IMeal, IRecipe, INutritionGoal, IWeightEntry, IChallenge 
} from './models.js';

export class MongoStorage implements IStorage {
  private connected: boolean = false;

  constructor() {
    const mongoUrl = process.env.MONGODB_URL || "mongodb+srv://vayuputra:Vayu123@cluster0.wxwtcpc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const dbName = process.env.MONGODB_DB_NAME || 'primeyouth';
    
    // Set the database name in the connection string
    const connectionString = mongoUrl.includes(dbName) ? mongoUrl : `${mongoUrl.replace('/?', `/${dbName}?`)}`;
    
    mongoose.connect(connectionString);
  }

  async connect(): Promise<void> {
    if (!this.connected) {
      try {
        await mongoose.connection.asPromise();
        console.log("Connected to MongoDB via Mongoose");
        this.connected = true;
      } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await mongoose.disconnect();
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
      console.log("Fetching exercises from MongoDB via Mongoose...");
      
      await this.connect();
      
      const mongoExercises = await Exercise.find({}).lean();
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
    const newExercise = new Exercise(exercise);
    const result = await newExercise.save();
    return result.toObject();
  }

  async getExerciseById(id: number): Promise<any> {
    await this.connect();
    
    try {
      // Try to find by _id if it's a valid ObjectId
      const exercise = await Exercise.findById(id.toString()).lean();
      
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
      console.error("Error finding exercise by ID:", error);
      return null;
    }
  }

  async getWorkouts(): Promise<any[]> {
    await this.connect();
    return await Workout.find({}).lean();
  }

  async getAllWorkouts(): Promise<any[]> {
    return await this.getWorkouts();
  }

  async createWorkout(workout: any): Promise<any> {
    await this.connect();
    const newWorkout = new Workout(workout);
    const result = await newWorkout.save();
    return result.toObject();
  }

  async getRecentWorkouts(): Promise<any[]> {
    await this.connect();
    return await Workout.find({}).sort({ date: -1 }).limit(5).lean();
  }

  async getMealsByDate(date: Date): Promise<any[]> {
    await this.connect();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await Meal.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).lean();
  }

  async getAllMeals(): Promise<any[]> {
    await this.connect();
    return await Meal.find({}).lean();
  }

  async createMeal(meal: any): Promise<any> {
    await this.connect();
    const newMeal = new Meal(meal);
    const result = await newMeal.save();
    return result.toObject();
  }

  async getNutritionGoals(): Promise<any[]> {
    await this.connect();
    return await NutritionGoal.find({}).lean();
  }

  async getAllNutritionGoals(): Promise<any[]> {
    return await this.getNutritionGoals();
  }

  async createNutritionGoal(goal: any): Promise<any> {
    await this.connect();
    const newGoal = new NutritionGoal(goal);
    const result = await newGoal.save();
    return result.toObject();
  }

  async createRecipe(recipe: any): Promise<any> {
    await this.connect();
    const newRecipe = new Recipe(recipe);
    const result = await newRecipe.save();
    return result.toObject();
  }

  async getAllRecipes(): Promise<any[]> {
    await this.connect();
    return await Recipe.find({}).lean();
  }

  async createChallenge(challenge: any): Promise<any> {
    await this.connect();
    const newChallenge = new Challenge(challenge);
    const result = await newChallenge.save();
    return result.toObject();
  }

  async getAllChallenges(): Promise<any[]> {
    await this.connect();
    return await Challenge.find({}).lean();
  }

  async createWeightEntry(weightEntry: any): Promise<any> {
    await this.connect();
    const newWeightEntry = new WeightEntry(weightEntry);
    const result = await newWeightEntry.save();
    return result.toObject();
  }

  async getWeightEntries(): Promise<any[]> {
    await this.connect();
    return await WeightEntry.find({}).sort({ date: -1 }).lean();
  }

  async getLatestWeight(): Promise<any> {
    await this.connect();
    return await WeightEntry.findOne({}).sort({ date: -1 }).lean();
  }
}
