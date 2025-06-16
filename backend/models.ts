
import mongoose, { Schema, Document } from 'mongoose';

// Exercise Schema
export interface IExercise extends Document {
  exercise_name: string;
  name?: string;
  muscle_group: string | string[];
  movement_type?: string;
  primary_function?: string;
  instructions?: string;
  difficulty_level?: string;
  equipment?: string | string[];
  variations?: string[];
  created_at?: Date;
}

const exerciseSchema = new Schema<IExercise>({
  exercise_name: { type: String, required: true },
  name: { type: String },
  muscle_group: { type: Schema.Types.Mixed },
  movement_type: { type: String },
  primary_function: { type: String },
  instructions: { type: String },
  difficulty_level: { type: String },
  equipment: { type: Schema.Types.Mixed },
  variations: [{ type: String }],
  created_at: { type: Date }
}, { collection: 'exercises' });

export const Exercise = mongoose.model<IExercise>('Exercise', exerciseSchema);

// Workout Schema
export interface IWorkout extends Document {
  name: string;
  date: Date;
  duration?: number;
  notes?: string;
  gender?: string;
  exercises?: any[];
}

const workoutSchema = new Schema<IWorkout>({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number },
  notes: { type: String },
  gender: { type: String, enum: ['male', 'female'], default: 'male' },
  exercises: [{ type: Schema.Types.Mixed }]
}, { collection: 'workouts', timestamps: true });

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);

// Meal Schema
export interface IMeal extends Document {
  name: string;
  date: Date;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  meal_type?: string;
}

const mealSchema = new Schema<IMeal>({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  calories: { type: Number },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number },
  meal_type: { type: String }
}, { collection: 'meals', timestamps: true });

export const Meal = mongoose.model<IMeal>('Meal', mealSchema);

// Recipe Schema
export interface IRecipe extends Document {
  name: string;
  ingredients: string[];
  instructions: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  calories_per_serving?: number;
}

const recipeSchema = new Schema<IRecipe>({
  name: { type: String, required: true },
  ingredients: [{ type: String }],
  instructions: { type: String, required: true },
  prep_time: { type: Number },
  cook_time: { type: Number },
  servings: { type: Number },
  calories_per_serving: { type: Number }
}, { collection: 'recipes', timestamps: true });

export const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);

// Nutrition Goal Schema
export interface INutritionGoal extends Document {
  user_id?: string;
  daily_calories: number;
  daily_protein: number;
  daily_carbs: number;
  daily_fat: number;
  created_date: Date;
}

const nutritionGoalSchema = new Schema<INutritionGoal>({
  user_id: { type: String },
  daily_calories: { type: Number, required: true },
  daily_protein: { type: Number, required: true },
  daily_carbs: { type: Number, required: true },
  daily_fat: { type: Number, required: true },
  created_date: { type: Date, default: Date.now }
}, { collection: 'nutrition_goals' });

export const NutritionGoal = mongoose.model<INutritionGoal>('NutritionGoal', nutritionGoalSchema);

// Weight Entry Schema
export interface IWeightEntry extends Document {
  weight: number;
  date: Date;
  notes?: string;
}

const weightEntrySchema = new Schema<IWeightEntry>({
  weight: { type: Number, required: true },
  date: { type: Date, required: true },
  notes: { type: String }
}, { collection: 'weight_entries', timestamps: true });

export const WeightEntry = mongoose.model<IWeightEntry>('WeightEntry', weightEntrySchema);

// Challenge Schema
export interface IChallenge extends Document {
  title: string;
  description: string;
  difficulty: string;
  points?: number;
  category?: string;
  date_created: Date;
}

const challengeSchema = new Schema<IChallenge>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  points: { type: Number },
  category: { type: String },
  date_created: { type: Date, default: Date.now }
}, { collection: 'challenges' });

export const Challenge = mongoose.model<IChallenge>('Challenge', challengeSchema);
