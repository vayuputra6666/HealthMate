import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import {
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
  type InsertDailyChallenge,
  type WeightEntry,
  type InsertWeightEntry,
  type UserProfile,
  type InsertUserProfile
} from "@shared/schema";
import { IStorage } from "./storage";

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private exercises: Collection;
  private workouts: Collection;
  private workoutExercises: Collection;
  private sets: Collection;
  private meals: Collection;
  private recipes: Collection;
  private nutritionGoals: Collection;
  private motivationalQuotes: Collection;
  private dailyChallenges: Collection;
  private weightEntries: Collection;
  private userProfiles: Collection;

  constructor() {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB_NAME || 'fitness_app';

    this.client = new MongoClient(mongoUrl);
    this.db = this.client.db(dbName);

    // Initialize collections
    this.exercises = this.db.collection('exercises');
    this.workouts = this.db.collection('workouts');
    this.workoutExercises = this.db.collection('workout_exercises');
    this.sets = this.db.collection('sets');
    this.meals = this.db.collection('meals');
    this.recipes = this.db.collection('recipes');
    this.nutritionGoals = this.db.collection('nutrition_goals');
    this.motivationalQuotes = this.db.collection('motivational_quotes');
    this.dailyChallenges = this.db.collection('daily_challenges');
    this.weightEntries = this.db.collection('weight_entries');
    this.userProfiles = this.db.collection('user_profiles');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log("Connected to MongoDB");
      
      // Use the database name from constructor
      const dbName = process.env.MONGODB_DB_NAME || 'fitness_app';
      this.db = this.client.db(dbName);

      // Initialize collections
      this.exercises = this.db.collection<Exercise>("exercises");
      this.workouts = this.db.collection<Workout>("workouts");
      this.workoutExercises = this.db.collection<WorkoutExercise>("workout_exercises");
      this.sets = this.db.collection<Set>("sets");
      this.meals = this.db.collection<Meal>("meals");
      this.recipes = this.db.collection<Recipe>("recipes");
      this.nutritionGoals = this.db.collection<NutritionGoal>("nutrition_goals");
      this.motivationalQuotes = this.db.collection<MotivationalQuote>("motivational_quotes");
      this.dailyChallenges = this.db.collection<DailyChallenge>("daily_challenges");
      this.weightEntries = this.db.collection<WeightEntry>("weight_entries");
      this.userProfiles = this.db.collection<UserProfile>("user_profiles");

      // Test the connection
      await this.db.admin().ping();
      console.log("MongoDB ping successful");

      // Initialize with default data if collections are empty
      await this.initializeData();
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      console.error("MongoDB connection failed, falling back to memory storage");
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  private async initializeData(): Promise<void> {
    try {
      console.log("Initializing MongoDB data...");

      // Check if exercises exist, if not, initialize them
      const exerciseCount = await this.exercises.countDocuments();
      console.log(`Found ${exerciseCount} exercises in database`);
      if (exerciseCount === 0) {
        console.log("Initializing exercises...");
        await this.initializeExercises();
      }

      // Initialize other collections similarly
      const recipeCount = await this.recipes.countDocuments();
      if (recipeCount === 0) {
        console.log("Initializing recipes...");
        await this.initializeRecipes();
      }

      const quoteCount = await this.motivationalQuotes.countDocuments();
      if (quoteCount === 0) {
        console.log("Initializing quotes...");
        await this.initializeMotivationalQuotes();
      }

      const challengeCount = await this.dailyChallenges.countDocuments();
      if (challengeCount === 0) {
        console.log("Initializing challenges...");
        await this.initializeDailyChallenges();
      }

      console.log("MongoDB data initialization completed");
    } catch (error) {
      console.error("Failed to initialize data:", error);
      throw error;
    }
  }

  private async initializeExercises(): Promise<void> {
    const commonExercises = [
      { 
        name: "Bench Press", 
        category: "chest", 
        instructions: "Lie on bench, lower bar to chest, press up",
        muscleGroups: ["chest", "triceps", "shoulders"],
        difficulty: "intermediate",
        equipment: ["barbell", "bench"]
      },
      { 
        name: "Squats", 
        category: "legs", 
        instructions: "Stand with feet shoulder-width apart, squat down, stand up",
        muscleGroups: ["quadriceps", "glutes", "hamstrings", "calves"],
        difficulty: "beginner",
        equipment: ["barbell", "squat rack"]
      },
      { 
        name: "Deadlift", 
        category: "back", 
        instructions: "Stand over bar, grip with both hands, lift with legs and back",
        muscleGroups: ["hamstrings", "glutes", "erector_spinae", "traps", "lats"],
        difficulty: "advanced",
        equipment: ["barbell", "plates"]
      },
      { 
        name: "Pull-ups", 
        category: "back", 
        instructions: "Hang from bar, pull body up until chin over bar",
        muscleGroups: ["lats", "rhomboids", "biceps", "traps"],
        difficulty: "intermediate",
        equipment: ["pull-up bar"]
      },
      { 
        name: "Overhead Press", 
        category: "shoulders", 
        instructions: "Press weight overhead from shoulder height",
        muscleGroups: ["shoulders", "triceps", "traps"],
        difficulty: "intermediate",
        equipment: ["barbell", "dumbbells"]
      }
    ];

    await this.exercises.insertMany(commonExercises);
  }

  private async initializeRecipes(): Promise<void> {
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
      }
    ];

    await this.recipes.insertMany(commonRecipes);
  }

  private async initializeMotivationalQuotes(): Promise<void> {
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
      }
    ];

    await this.motivationalQuotes.insertMany(quotes);
  }

  private async initializeDailyChallenges(): Promise<void> {
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
      }
    ];

    await this.dailyChallenges.insertMany(challenges);
  }

  // Exercise methods
  async getAllExercises(): Promise<Exercise[]> {
    try {
      if (!this.exercises) {
        throw new Error("Exercises collection not initialized");
      }
      const exercises = await this.exercises.find({}).toArray();
      console.log(`Retrieved ${exercises.length} exercises from MongoDB`);
      return exercises.map((exercise, index) => ({ 
        ...exercise, 
        id: exercise.id || index + 1,
        _id: undefined // Remove MongoDB _id field
      }));
    } catch (error) {
      console.error("Failed to get exercises from MongoDB:", error);
      throw error;
    }
  }

  async getExerciseById(id: number): Promise<Exercise | undefined> {
    const doc = await this.exercises.findOne({ _id: new ObjectId(id.toString()) });
    return doc ? { ...doc, id: doc._id.toString() } : undefined;
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const result = await this.exercises.insertOne({
      ...exercise,
      instructions: exercise.instructions ?? null,
      muscleGroups: exercise.muscleGroups ?? null,
      difficulty: exercise.difficulty ?? "beginner",
      equipment: exercise.equipment ?? []
    });

    const doc = await this.exercises.findOne({ _id: result.insertedId });
    return { ...doc, id: doc._id.toString() };
  }

  // Workout methods
  async getAllWorkouts(): Promise<Workout[]> {
    const docs = await this.workouts.find({}).sort({ date: -1 }).toArray();
    return docs.map(doc => ({ 
      ...doc, 
      id: doc._id.toString(),
      createdAt: doc.createdAt || new Date()
    }));
  }

  async getWorkoutById(id: number): Promise<WorkoutWithExercises | undefined> {
    const workoutDoc = await this.workouts.findOne({ _id: new ObjectId(id.toString()) });
    if (!workoutDoc) return undefined;

    const workout = { ...workoutDoc, id: workoutDoc._id.toString() };

    const workoutExerciseDocs = await this.workoutExercises
      .find({ workoutId: id })
      .sort({ orderIndex: 1 })
      .toArray();

    const exercises = await Promise.all(
      workoutExerciseDocs.map(async (we) => {
        const exerciseDoc = await this.exercises.findOne({ _id: new ObjectId(we.exerciseId.toString()) });
        const exercise = { ...exerciseDoc, id: exerciseDoc._id.toString() };

        const setDocs = await this.sets
          .find({ workoutExerciseId: we._id.toString() })
          .sort({ setNumber: 1 })
          .toArray();

        const sets = setDocs.map(set => ({ ...set, id: set._id.toString() }));

        return {
          ...we,
          id: we._id.toString(),
          exercise,
          sets,
        };
      })
    );

    return {
      ...workout,
      exercises,
    };
  }

  async createWorkout(createWorkout: CreateWorkout): Promise<WorkoutWithExercises> {
    const workoutResult = await this.workouts.insertOne({
      name: createWorkout.name,
      date: createWorkout.date,
      duration: createWorkout.duration ?? null,
      notes: createWorkout.notes ?? null,
      gender: createWorkout.gender ?? "male",
      createdAt: new Date(),
    });

    const workoutId = workoutResult.insertedId.toString();
    const workout = await this.workouts.findOne({ _id: workoutResult.insertedId });

    const exercises = [];
    for (let i = 0; i < createWorkout.exercises.length; i++) {
      const exerciseData = createWorkout.exercises[i];

      const workoutExerciseResult = await this.workoutExercises.insertOne({
        workoutId: parseInt(workoutId),
        exerciseId: exerciseData.exerciseId,
        orderIndex: i,
      });

      const exerciseDoc = await this.exercises.findOne({ _id: new ObjectId(exerciseData.exerciseId.toString()) });
      const exercise = { ...exerciseDoc, id: exerciseDoc._id.toString() };

      const exerciseSets = [];
      for (let j = 0; j < exerciseData.sets.length; j++) {
        const setData = exerciseData.sets[j];
        const setResult = await this.sets.insertOne({
          workoutExerciseId: workoutExerciseResult.insertedId.toString(),
          setNumber: j + 1,
          weight: setData.weight ?? null,
          reps: setData.reps ?? null,
          completed: 1,
        });

        const setDoc = await this.sets.findOne({ _id: setResult.insertedId });
        exerciseSets.push({ ...setDoc, id: setDoc._id.toString() });
      }

      const workoutExerciseDoc = await this.workoutExercises.findOne({ _id: workoutExerciseResult.insertedId });
      exercises.push({
        ...workoutExerciseDoc,
        id: workoutExerciseDoc._id.toString(),
        exercise,
        sets: exerciseSets,
      });
    }

    return {
      ...workout,
      id: workout._id.toString(),
      exercises,
    };
  }

  async updateWorkout(id: number, updateData: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const result = await this.workouts.findOneAndUpdate(
      { _id: new ObjectId(id.toString()) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    return result.value ? { ...result.value, id: result.value._id.toString() } : undefined;
  }

  async deleteWorkout(id: number): Promise<boolean> {
    const workoutExerciseDocs = await this.workoutExercises.find({ workoutId: id }).toArray();

    for (const we of workoutExerciseDocs) {
      await this.sets.deleteMany({ workoutExerciseId: we._id.toString() });
    }

    await this.workoutExercises.deleteMany({ workoutId: id });
    const result = await this.workouts.deleteOne({ _id: new ObjectId(id.toString()) });

    return result.deletedCount > 0;
  }

  async getWorkoutStats(): Promise<{ weeklyWorkouts: number; totalWeight: number; avgDuration: number; }> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyWorkouts = await this.workouts.countDocuments({
      date: { $gte: weekAgo }
    });

    const workouts = await this.workouts.find({}).toArray();
    let totalWeight = 0;
    let totalDuration = 0;
    let workoutCount = 0;

    for (const workout of workouts) {
      if (workout.duration) {
        totalDuration += workout.duration;
        workoutCount++;
      }

      const workoutExercises = await this.workoutExercises.find({ workoutId: workout._id.toString() }).toArray();
      for (const we of workoutExercises) {
        const sets = await this.sets.find({ 
          workoutExerciseId: we._id.toString(),
          completed: 1 
        }).toArray();

        for (const set of sets) {
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

  // Meal methods
  async createMeal(mealData: InsertMeal): Promise<Meal> {
    const result = await this.meals.insertOne({
      ...mealData,
      createdAt: new Date(),
    });

    const doc = await this.meals.findOne({ _id: result.insertedId });
    return { ...doc, id: doc._id.toString() };
  }

  async getMealsByDate(date: Date): Promise<Meal[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const docs = await this.meals.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).toArray();

    return docs.map(doc => ({ ...doc, id: doc._id.toString() }));
  }

  // Recipe methods
  async getAllRecipes(): Promise<Recipe[]> {
    const docs = await this.recipes.find({}).toArray();
    return docs.map(doc => ({ ...doc, id: doc._id.toString() }));
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const result = await this.recipes.insertOne(recipe);
    const doc = await this.recipes.findOne({ _id: result.insertedId });
    return { ...doc, id: doc._id.toString() };
  }

  // Nutrition goals methods
  async getNutritionGoals(): Promise<NutritionGoal | undefined> {
    const doc = await this.nutritionGoals.findOne({});
    return doc ? { ...doc, id: doc._id.toString() } : undefined;
  }

  async updateNutritionGoals(goals: InsertNutritionGoal): Promise<NutritionGoal> {
    const result = await this.nutritionGoals.findOneAndUpdate(
      {},
      { $set: { ...goals, updatedAt: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );

    return { ...result.value, id: result.value._id.toString() };
  }

  // Weight tracking methods
  async createWeightEntry(weightEntry: InsertWeightEntry): Promise<WeightEntry> {
    const result = await this.weightEntries.insertOne({
      ...weightEntry,
      createdAt: new Date(),
    });

    const doc = await this.weightEntries.findOne({ _id: result.insertedId });
    return { ...doc, id: doc._id.toString() };
  }

  async getWeightEntries(): Promise<WeightEntry[]> {
    const docs = await this.weightEntries.find({}).sort({ date: -1 }).toArray();
    return docs.map(doc => ({ ...doc, id: doc._id.toString() }));
  }

  async getLatestWeight(): Promise<WeightEntry | undefined> {
    const doc = await this.weightEntries.findOne({}, { sort: { date: -1 } });
    return doc ? { ...doc, id: doc._id.toString() } : undefined;
  }

  // User profile methods
  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const result = await this.userProfiles.insertOne({
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const doc = await this.userProfiles.findOne({ _id: result.insertedId });
    return { ...doc, id: doc._id.toString() };
  }

  async getUserProfile(): Promise<UserProfile | undefined> {
    const doc = await this.userProfiles.findOne({});
    return doc ? { ...doc, id: doc._id.toString() } : undefined;
  }

  async updateUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const result = await this.userProfiles.findOneAndUpdate(
      {},
      { $set: { ...profile, updatedAt: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );

    return { ...result.value, id: result.value._id.toString() };
  }

  // Calculation methods
  calculateBMI(weight: number, height: number, weightUnit: 'lbs' | 'kg', heightUnit: 'inches' | 'cm'): number {
    let weightKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    let heightM = heightUnit === 'inches' ? height * 0.0254 : height / 100;
    return weightKg / (heightM * heightM);
  }

  calculateMaintenanceCalories(profile: UserProfile, weight: number): number {
    if (!profile.age || !profile.height) return 0;

    let bmr: number;
    const weightKg = weight * 0.453592;
    const heightCm = profile.heightUnit === 'inches' ? profile.height * 2.54 : profile.height;

    if (profile.gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * profile.age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * profile.age - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    return Math.round(bmr * activityMultipliers.moderate);
  }

  // Motivational content methods
  async getRandomQuote(): Promise<MotivationalQuote | undefined> {
    const count = await this.motivationalQuotes.countDocuments();
    if (count === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * count);
    const doc = await this.motivationalQuotes.findOne({}, { skip: randomIndex });
    return doc ? { ...doc, id: doc._id.toString() } : undefined;
  }

  async getQuotesByCategory(category: string): Promise<MotivationalQuote[]> {
    const docs = await this.motivationalQuotes.find({ category }).toArray();
    return docs.map(doc => ({ ...doc, id: doc._id.toString() }));
  }

  async getTodaysChallenge(): Promise<DailyChallenge | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const doc = await this.dailyChallenges.findOne({
      date: { $gte: today, $lt: tomorrow }
    });

    return doc ? { ...doc, id: doc._id.toString() } : undefined;
  }

  async getAllChallenges(): Promise<DailyChallenge[]> {
    const docs = await this.dailyChallenges.find({}).toArray();
    return docs.map(doc => ({ ...doc, id: doc._id.toString() }));
  }
}