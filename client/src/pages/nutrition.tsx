import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

import { Plus, Apple, Target, TrendingUp } from "lucide-react";
import { LoadingState, EmptyState, LoadingSpinner } from "@/components/ui/loading";

interface Meal {
  id: number;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Recipe {
  id: number;
  name: string;
  description: string;
  instructions: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  tags: string[];
}

interface NutritionGoals {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  maintenanceCalories?: number;
  weightGoal?: "lose" | "maintain" | "gain";
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
}

interface WeightEntry {
  id: number;
  weight: string;
  unit: "lbs" | "kg";
  date: string;
  notes?: string;
}

interface UserProfile {
  id: number;
  height?: string;
  heightUnit: "inches" | "cm";
  age?: number;
  gender: "male" | "female";
}

export default function Nutrition() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newWeight, setNewWeight] = useState({
    weight: "",
    unit: "lbs" as const,
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });
  const [profileData, setProfileData] = useState({
    height: "",
    heightUnit: "inches" as const,
    age: "",
    gender: "male" as const
  });
  const [newMeal, setNewMeal] = useState({
    name: "",
    type: "breakfast" as const,
    calories: "",
    protein: "",
    carbs: "",
    fat: ""
  });
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    description: "",
    instructions: "",
    servings: 1,
    prepTime: 0,
    cookTime: 0,
    calories: 0,
    protein: "",
    carbs: "",
    fat: "",
    ingredients: [""],
    tags: [""]
  });

  const { data: meals, isLoading: mealsLoading } = useQuery<Meal[]>({
    queryKey: ['meals', selectedDate],
    queryFn: async () => {
      const response = await fetch(`/api/meals/${selectedDate}`);
      if (!response.ok) throw new Error('Failed to fetch meals');
      return response.json();
    },
  });

  const { data: recipes, isLoading: recipesLoading } = useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: async () => {
      const response = await fetch('/api/recipes');
      if (!response.ok) throw new Error('Failed to fetch recipes');
      return response.json();
    },
  });

  const { data: nutritionGoals, isLoading: goalsLoading } = useQuery<NutritionGoals>({
    queryKey: ['nutrition-goals'],
    queryFn: async () => {
      const response = await fetch('/api/nutrition-goals');
      if (!response.ok) throw new Error('Failed to fetch nutrition goals');
      return response.json();
    },
  });

  const { data: weightEntries = [] } = useQuery<WeightEntry[]>({
    queryKey: ['weight-entries'],
    queryFn: async () => {
      const response = await fetch('/api/weight');
      if (!response.ok) throw new Error('Failed to fetch weight entries');
      return response.json();
    },
  });

  const { data: latestWeight } = useQuery<WeightEntry>({
    queryKey: ['latest-weight'],
    queryFn: async () => {
      const response = await fetch('/api/weight/latest');
      if (!response.ok) throw new Error('Failed to fetch latest weight');
      return response.json();
    },
  });

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Failed to fetch user profile');
      return response.json();
    },
  });

  const { data: bmiData } = useQuery<{ bmi: number }>({
    queryKey: ['bmi'],
    queryFn: async () => {
      const response = await fetch('/api/bmi');
      if (!response.ok) throw new Error('Failed to fetch BMI');
      return response.json();
    },
    enabled: !!latestWeight && !!userProfile?.height,
  });

  const { data: calorieData } = useQuery<{ maintenanceCalories: number; recommendedCalories: number; weightGoal: string }>({
    queryKey: ['maintenance-calories'],
    queryFn: async () => {
      const response = await fetch('/api/maintenance-calories');
      if (!response.ok) throw new Error('Failed to fetch maintenance calories');
      return response.json();
    },
    enabled: !!latestWeight && !!userProfile,
  });

  const addMeal = async () => {
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMeal,
          date: new Date(selectedDate + 'T12:00:00'),
          calories: parseInt(newMeal.calories) || 0,
          protein: parseFloat(newMeal.protein) || 0,
          carbs: parseFloat(newMeal.carbs) || 0,
          fat: parseFloat(newMeal.fat) || 0,
        }),
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['meals'] });
        setShowMealModal(false);
        setNewMeal({
          name: "",
          type: "breakfast",
          calories: "",
          protein: "",
          carbs: "",
          fat: ""
        });
      }
    } catch (error) {
      console.error('Failed to add meal:', error);
    }
  };

  const addRecipe = async () => {
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRecipe,
          ingredients: newRecipe.ingredients.filter(i => i.trim()),
          tags: newRecipe.tags.filter(t => t.trim()),
        }),
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['recipes'] });
        setShowRecipeModal(false);
        setNewRecipe({
          name: "",
          description: "",
          instructions: "",
          servings: 1,
          prepTime: 0,
          cookTime: 0,
          calories: 0,
          protein: "",
          carbs: "",
          fat: "",
          ingredients: [""],
          tags: [""]
        });
      }
    } catch (error) {
      console.error('Failed to add recipe:', error);
    }
  };

  const addWeight = async () => {
    try {
      const response = await fetch('/api/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newWeight,
          weight: parseFloat(newWeight.weight),
          date: new Date(newWeight.date + 'T12:00:00'),
        }),
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['weight-entries'] });
        queryClient.invalidateQueries({ queryKey: ['latest-weight'] });
        queryClient.invalidateQueries({ queryKey: ['bmi'] });
        queryClient.invalidateQueries({ queryKey: ['maintenance-calories'] });
        setShowWeightModal(false);
        setNewWeight({
          weight: "",
          unit: "lbs",
          date: new Date().toISOString().split('T')[0],
          notes: ""
        });
      }
    } catch (error) {
      console.error('Failed to add weight:', error);
    }
  };

  const updateProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileData,
          height: parseFloat(profileData.height) || undefined,
          age: parseInt(profileData.age) || undefined,
        }),
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        queryClient.invalidateQueries({ queryKey: ['bmi'] });
        queryClient.invalidateQueries({ queryKey: ['maintenance-calories'] });
        setShowProfileModal(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const dailyTotals = meals?.reduce((totals, meal) => ({
    calories: totals.calories + (meal.calories || 0),
    protein: totals.protein + (meal.protein || 0),
    carbs: totals.carbs + (meal.carbs || 0),
    fat: totals.fat + (meal.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const mealsByType = meals?.reduce((acc, meal) => {
    if (!acc[meal.type]) acc[meal.type] = [];
    acc[meal.type].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);

    if (mealsLoading || goalsLoading || recipesLoading) {
    return <LoadingState message="Loading nutrition data..." />;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🥗 Nutrition Planning</h1>
          <p className="text-gray-600">Track your meals, macros, and achieve your nutrition goals</p>
        </div>

        <Tabs defaultValue="tracking" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="tracking">Meal Tracking</TabsTrigger>
            <TabsTrigger value="weight">Weight & BMI</TabsTrigger>
            <TabsTrigger value="calories">Macro Calculator</TabsTrigger>
            <TabsTrigger value="recipes">Recipe Database</TabsTrigger>
            <TabsTrigger value="goals">Nutrition Goals</TabsTrigger>
            <TabsTrigger value="grocery">Grocery List</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-6">
            {/* Daily Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Daily Nutrition Overview</CardTitle>
                    <CardDescription>Track your macros and calories</CardDescription>
                  </div>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{dailyTotals?.calories}</div>
                    <div className="text-sm text-gray-500">Calories</div>
                    {nutritionGoals && (
                      <Progress 
                        value={((dailyTotals?.calories || 0) / nutritionGoals.dailyCalories) * 100} 
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{dailyTotals?.protein?.toFixed(1)}g</div>
                    <div className="text-sm text-gray-500">Protein</div>
                    {nutritionGoals && (
                      <Progress 
                        value={((dailyTotals?.protein || 0) / nutritionGoals.dailyProtein) * 100} 
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{dailyTotals?.carbs?.toFixed(1)}g</div>
                    <div className="text-sm text-gray-500">Carbs</div>
                    {nutritionGoals && (
                      <Progress 
                        value={((dailyTotals?.carbs || 0) / nutritionGoals.dailyCarbs) * 100} 
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{dailyTotals?.fat?.toFixed(1)}g</div>
                    <div className="text-sm text-gray-500">Fat</div>
                    {nutritionGoals && (
                      <Progress 
                        value={((dailyTotals?.fat || 0) / nutritionGoals.dailyFat) * 100} 
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meals by Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
                <Card key={mealType}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg capitalize flex items-center justify-between">
                      {mealType === 'breakfast' && '🌅'} 
                      {mealType === 'lunch' && '🌞'} 
                      {mealType === 'dinner' && '🌙'} 
                      {mealType === 'snack' && '🥨'} 
                      {mealType}
                      <Dialog open={showMealModal} onOpenChange={setShowMealModal}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setNewMeal(prev => ({ ...prev, type: mealType as any }))}
                          >
                            +
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                  <div className="space-y-2">
                {!mealsByType || Object.keys(mealsByType).length === 0 ? (
                  <EmptyState
                    title={`No ${mealType} logged today`}
                    description={`Add your first ${mealType} to start tracking.`}
                    icon={<Apple className="w-8 h-8" />}
                    action={
                      <Button onClick={() => document.getElementById('meal-name')?.focus()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Meal
                      </Button>
                    }
                  />
                ) : (
                  mealsByType[mealType]?.map((meal) => (
                    <div key={meal.id} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="font-medium">{meal.name}</div>
                      <div className="text-gray-500 text-xs">
                        {meal.calories} cal • {meal.protein}p • {meal.carbs}c • {meal.fat}f
                      </div>
                    </div>
                  ))
                )}
              </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weight" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Weight & BMI Tracking</h2>
              <div className="space-x-2">
                <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Update Profile</Button>
                  </DialogTrigger>
                </Dialog>
                <Dialog open={showWeightModal} onOpenChange={setShowWeightModal}>
                  <DialogTrigger asChild>
                    <Button>Add Weight</Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Weight</CardTitle>
                  <CardDescription>Latest entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {latestWeight ? (
                    <div>
                      <div className="text-3xl font-bold">{latestWeight.weight} {latestWeight.unit}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(latestWeight.date).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No weight entries yet</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>BMI</CardTitle>
                  <CardDescription>Body Mass Index</CardDescription>
                </CardHeader>
                <CardContent>
                  {bmiData ? (
                    <div>
                      <div className="text-3xl font-bold">{bmiData.bmi}</div>
                      <div className="text-sm text-gray-500">
                        {bmiData.bmi < 18.5 ? 'Underweight' : 
                         bmiData.bmi < 25 ? 'Normal' : 
                         bmiData.bmi < 30 ? 'Overweight' : 'Obese'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">Add height and weight to calculate BMI</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Info</CardTitle>
                  <CardDescription>Height, age, gender</CardDescription>
                </CardHeader>
                <CardContent>
                  {userProfile ? (
                    <div className="space-y-1">
                      {userProfile.height && (
                        <div className="text-sm">Height: {userProfile.height} {userProfile.heightUnit}</div>
                      )}
                      {userProfile.age && (
                        <div className="text-sm">Age: {userProfile.age}</div>
                      )}
                      <div className="text-sm">Gender: {userProfile.gender}</div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No profile data</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weight History</CardTitle>
                <CardDescription>Track your progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {weightEntries.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{entry.weight} {entry.unit}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                      {entry.notes && (
                        <div className="text-sm text-gray-600">{entry.notes}</div>
                      )}
                    </div>
                  ))}
                  {weightEntries.length === 0 && (
                    <div className="text-center py-4 text-gray-500">No weight entries yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calorie & Macro Calculator</CardTitle>
                <CardDescription>Personalized calorie recommendations based on your goals</CardDescription>
              </CardHeader>
              <CardContent>
                {calorieData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{calorieData.maintenanceCalories}</div>
                        <div className="text-sm text-gray-500">Maintenance Calories</div>
                        <div className="text-xs text-gray-400">Calories to maintain current weight</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{calorieData.recommendedCalories}</div>
                        <div className="text-sm text-gray-500">Recommended Calories</div>
                        <div className="text-xs text-gray-400">
                          Based on your goal: {calorieData.weightGoal}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Macro Breakdown</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Protein (25%):</span>
                          <span>{Math.round(calorieData.recommendedCalories * 0.25 / 4)}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbs (45%):</span>
                          <span>{Math.round(calorieData.recommendedCalories * 0.45 / 4)}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fat (30%):</span>
                          <span>{Math.round(calorieData.recommendedCalories * 0.30 / 9)}g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Add your profile and weight to calculate personalized calorie recommendations</p>
                    <div className="space-x-2">
                      <Button onClick={() => setShowProfileModal(true)} variant="outline">Add Profile</Button>
                      <Button onClick={() => setShowWeightModal(true)}>Add Weight</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recipe Database</h2>
                            {recipesLoading ? (
                  <LoadingSpinner />
                ) : (
              <Dialog open={showRecipeModal} onOpenChange={setShowRecipeModal}>
                <DialogTrigger asChild>
                  <Button>Add Recipe</Button>
                </DialogTrigger>
              </Dialog>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recipesLoading ? (
                  <LoadingSpinner />
                ) : recipes?.map((recipe) => (
                <Card key={recipe.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                    <CardDescription>{recipe.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                        <span>🍽️ {recipe.servings} servings</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold">{recipe.calories}</div>
                          <div className="text-gray-500">cal</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{recipe.protein}g</div>
                          <div className="text-gray-500">protein</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{recipe.carbs}g</div>
                          <div className="text-gray-500">carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{recipe.fat}g</div>
                          <div className="text-gray-500">fat</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {recipe.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                                ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Goals</CardTitle>
                <CardDescription>Set your daily macro and calorie targets</CardDescription>
              </CardHeader>
              <CardContent>
                 {goalsLoading ? (
                  <LoadingSpinner />
                ) : 
                nutritionGoals ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{nutritionGoals.dailyCalories}</div>
                      <div className="text-sm text-gray-500">Daily Calories</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{nutritionGoals.dailyProtein}g</div>
                      <div className="text-sm text-gray-500">Protein</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{nutritionGoals.dailyCarbs}g</div>
                      <div className="text-sm text-gray-500">Carbs</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">{nutritionGoals.dailyFat}g</div>
                      <div className="text-sm text-gray-500">Fat</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No nutrition goals set yet</p>
                    <Button onClick={() => setShowGoalsModal(true)}>Set Goals</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grocery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Grocery List Generator</CardTitle>
                <CardDescription>Generate shopping lists based on your meal plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Smart grocery list generation coming soon!</p>
                  <p className="text-sm text-gray-400">
                    This feature will automatically generate shopping lists based on your planned meals and recipes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Meal Modal */}
        <Dialog open={showMealModal} onOpenChange={setShowMealModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Meal</DialogTitle>
              <DialogDescription>
                Add a new meal entry to track your daily nutrition intake.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="meal-name">Meal Name</Label>
                                <Input
                    id="meal-name"
                    placeholder="Meal name"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  />
              </div>

              <div>
                <Label htmlFor="meal-type">Meal Type</Label>
                <Select 
                  value={newMeal.type} 
                  onValueChange={(value) => setNewMeal(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, calories: e.target.value }))}
                    placeholder="300"
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, protein: e.target.value }))}
                    placeholder="25.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, carbs: e.target.value }))}
                    placeholder="15.0"
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, fat: e.target.value }))}
                    placeholder="8.5"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowMealModal(false)}>
                  Cancel
                </Button>
                <Button onClick={addMeal}>Add Meal</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Weight Modal */}
        <Dialog open={showWeightModal} onOpenChange={setShowWeightModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Weight Entry</DialogTitle>
              <DialogDescription>
                Record your current weight to track your progress over time.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={newWeight.weight}
                    onChange={(e) => setNewWeight(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="180.5"
                  />
                </div>
                <div>
                  <Label htmlFor="weight-unit">Unit</Label>
                  <Select 
                    value={newWeight.unit} 
                    onValueChange={(value: "lbs" | "kg") => setNewWeight(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lbs">lbs</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="weight-date">Date</Label>
                <Input
                  id="weight-date"
                  type="date"
                  value={newWeight.date}
                  onChange={(e) => setNewWeight(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="weight-notes">Notes (optional)</Label>
                <Textarea
                  id="weight-notes"
                  value={newWeight.notes}
                  onChange={(e) => setNewWeight(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How are you feeling today?"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowWeightModal(false)}>
                  Cancel
                </Button>
                <Button onClick={addWeight}>Add Weight</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Profile Modal */}
        <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Profile</DialogTitle>
              <DialogDescription>
                Update your profile information to get accurate BMI and calorie calculations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={profileData.height}
                    onChange={(e) => setProfileData(prev => ({ ...prev, height: e.target.value }))}
                    placeholder="70"
                  />
                </div>
                <div>
                  <Label htmlFor="height-unit">Unit</Label>
                  <Select 
                    value={profileData.heightUnit} 
                    onValueChange={(value: "inches" | "cm") => setProfileData(prev => ({ ...prev, heightUnit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inches">inches</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="25"
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={profileData.gender} 
                  onValueChange={(value: "male" | "female") => setProfileData(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </Button>
                <Button onClick={updateProfile}>Update Profile</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Recipe Modal */}
        <Dialog open={showRecipeModal} onOpenChange={setShowRecipeModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Recipe</DialogTitle>
              <DialogDescription>
                Create a new recipe with ingredients, instructions, and nutritional information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipe-name">Recipe Name</Label>
                <Input
                  id="recipe-name"
                  value={newRecipe.name}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., High-Protein Pancakes"
                />
              </div>

              <div>
                <Label htmlFor="recipe-description">Description</Label>
                <Input
                  id="recipe-description"
                  value={newRecipe.description}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the recipe"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={newRecipe.servings}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="prep-time">Prep Time (min)</Label>
                  <Input
                    id="prep-time"
                    type="number"
                    value={newRecipe.prepTime}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cook-time">Cook Time (min)</Label>
                  <Input
                    id="cook-time"
                    type="number"
                    value={newRecipe.cookTime}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={newRecipe.instructions}
                  onChange={(e) => setNewRecipe(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Step-by-step cooking instructions..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowRecipeModal(false)}>
                  Cancel
                </Button>
                <Button onClick={addRecipe}>Add Recipe</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}