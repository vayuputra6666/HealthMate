import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Target, TrendingUp, Utensils, Calculator } from "lucide-react";
import { LoadingState, EmptyState } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

interface Meal {
  id: number;
  name: string;
  type: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionGoals {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  weightGoal: string;
}

export default function Nutrition() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: meals, isLoading: mealsLoading } = useQuery({
    queryKey: ["/api/meals", selectedDate],
    queryFn: () => fetch(`/api/meals/${selectedDate}`).then((res) => res.json()),
  });

  const { data: goals } = useQuery({
    queryKey: ["/api/nutrition-goals"],
    queryFn: () => fetch("/api/nutrition-goals").then((res) => res.json()),
  });

  const { data: recipes } = useQuery({
    queryKey: ["/api/recipes"],
    queryFn: () => fetch("/api/recipes").then((res) => res.json()),
  });

  const { data: calorieInfo } = useQuery({
    queryKey: ["/api/maintenance-calories"],
    queryFn: () => fetch("/api/maintenance-calories").then((res) => res.json()),
  });

  const mealForm = useForm({
    defaultValues: {
      name: "",
      type: "breakfast",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  });

  const goalsForm = useForm<NutritionGoals>({
    defaultValues: goals || {
      dailyCalories: 2000,
      dailyProtein: 150,
      dailyCarbs: 250,
      dailyFat: 67,
      weightGoal: "maintain",
    },
  });

  const addMealMutation = useMutation({
    mutationFn: async (meal: { name: string; calories: number; protein: number; carbs: number; fat: number; date: Date; mealType: string }) => {
      const mealData = {
        ...meal,
        date: meal.date.toISOString().split('T')[0], // Convert date to string format
      };
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add meal");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals", selectedDate] });
      toast({ title: "Meal added successfully!" });
      setShowAddMeal(false);
      mealForm.reset();
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to add meal. Please try again.",
        variant: "destructive"
      });
    },
  });

  const updateGoalsMutation = useMutation({
    mutationFn: async (data: NutritionGoals) => {
      const response = await fetch("/api/nutrition-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update goals");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition-goals"] });
      toast({ title: "Goals updated successfully!" });
      setShowGoalsModal(false);
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to update goals. Please try again.",
        variant: "destructive"
      });
    },
  });

  // Calculate daily totals
  const dailyTotals = meals?.reduce(
    (totals: any, meal: Meal) => ({
      calories: totals.calories + (meal.calories || 0),
      protein: totals.protein + (parseFloat(meal.protein?.toString() || '0')),
      carbs: totals.carbs + (parseFloat(meal.carbs?.toString() || '0')),
      fat: totals.fat + (parseFloat(meal.fat?.toString() || '0')),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const mealsByType = {
    breakfast: meals?.filter((meal: Meal) => meal.type === 'breakfast') || [],
    lunch: meals?.filter((meal: Meal) => meal.type === 'lunch') || [],
    dinner: meals?.filter((meal: Meal) => meal.type === 'dinner') || [],
    snack: meals?.filter((meal: Meal) => meal.type === 'snack') || [],
  };

  if (mealsLoading) {
    return <LoadingState message="Loading nutrition data..." />;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Nutrition</h1>
          <p className="text-muted-foreground mt-2">Track your daily nutrition and reach your goals</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowGoalsModal(true)}>
            <Target className="w-4 h-4 mr-2" />
            Set Goals
          </Button>
          <Button onClick={() => setShowAddMeal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Meal
          </Button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="mb-8">
        <Label htmlFor="date">Select Date</Label>
        <Input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-48 mt-1"
        />
      </div>

      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Utensils className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(dailyTotals.calories)}</div>
            <p className="text-xs text-muted-foreground">
              of {goals?.dailyCalories || 2000} target
            </p>
            <Progress 
              value={(dailyTotals.calories / (goals?.dailyCalories || 2000)) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(dailyTotals.protein)}g</div>
            <p className="text-xs text-muted-foreground">
              of {goals?.dailyProtein || 150}g target
            </p>
            <Progress 
              value={(dailyTotals.protein / (goals?.dailyProtein || 150)) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbs</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(dailyTotals.carbs)}g</div>
            <p className="text-xs text-muted-foreground">
              of {goals?.dailyCarbs || 250}g target
            </p>
            <Progress 
              value={(dailyTotals.carbs / (goals?.dailyCarbs || 250)) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fat</CardTitle>
            <Calculator className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(dailyTotals.fat)}g</div>
            <p className="text-xs text-muted-foreground">
              of {goals?.dailyFat || 67}g target
            </p>
            <Progress 
              value={(dailyTotals.fat / (goals?.dailyFat || 67)) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="meals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meals">Meals</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="meals" className="space-y-6">
          {Object.entries(mealsByType).map(([type, typeMeals]) => (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="capitalize">{type}</CardTitle>
                <CardDescription>
                  {typeMeals.length} item{typeMeals.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {typeMeals.length === 0 ? (
                  <EmptyState
                    title={`No ${type} logged`}
                    description={`Add your ${type} to track your nutrition.`}
                    icon={<Utensils className="w-8 h-8" />}
                    action={
                      <Button size="sm" onClick={() => setShowAddMeal(true)}>
                        Add {type}
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {typeMeals.map((meal: Meal) => (
                      <div key={meal.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <h4 className="font-medium">{meal.name}</h4>
                          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                            <span>{meal.calories} cal</span>
                            <span>{meal.protein}g protein</span>
                            <span>{meal.carbs}g carbs</span>
                            <span>{meal.fat}g fat</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {meal.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recipes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Library</CardTitle>
              <CardDescription>Healthy recipes to support your nutrition goals</CardDescription>
            </CardHeader>
            <CardContent>
              {recipes && recipes.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recipes.map((recipe: any) => (
                    <Card key={recipe.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{recipe.name}</CardTitle>
                        <CardDescription>{recipe.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Servings:</span>
                            <span>{recipe.servings}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Prep Time:</span>
                            <span>{recipe.prepTime} min</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Calories:</span>
                            <span>{recipe.calories} per serving</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {recipe.tags?.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No recipes yet"
                  description="Add some healthy recipes to your library."
                  icon={<Utensils className="w-8 h-8" />}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calorie Recommendations</CardTitle>
              <CardDescription>Based on your profile and goals</CardDescription>
            </CardHeader>
            <CardContent>
              {calorieInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold">{calorieInfo.maintenanceCalories}</div>
                      <div className="text-sm text-muted-foreground">Maintenance</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold">{calorieInfo.recommendedCalories}</div>
                      <div className="text-sm text-muted-foreground">Recommended</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold capitalize">{calorieInfo.weightGoal}</div>
                      <div className="text-sm text-muted-foreground">Goal</div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="Set up your profile"
                  description="Complete your profile to get personalized calorie recommendations."
                  icon={<Calculator className="w-8 h-8" />}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Meal Modal */}
      <Dialog open={showAddMeal} onOpenChange={setShowAddMeal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Meal</DialogTitle>
          </DialogHeader>
          <form onSubmit={mealForm.handleSubmit((data) => {
            const mealData = {
              name: data.name,
              calories: data.calories,
              protein: data.protein,
              carbs: data.carbs,
              fat: data.fat,
              date: new Date(selectedDate),
              mealType: data.type,
            };
            addMealMutation.mutate(mealData);
          })} className="space-y-4">
            <div>
              <Label htmlFor="meal-name">Meal Name</Label>
              <Input
                id="meal-name"
                {...mealForm.register("name", { required: true })}
                placeholder="e.g., Grilled Chicken Salad"
              />
            </div>

            <div>
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={mealForm.watch("type")} onValueChange={(value) => mealForm.setValue("type", value)}>
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
                  {...mealForm.register("calories", { valueAsNumber: true })}
                  placeholder="400"
                />
              </div>
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  step="0.1"
                  {...mealForm.register("protein", { valueAsNumber: true })}
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  step="0.1"
                  {...mealForm.register("carbs", { valueAsNumber: true })}
                  placeholder="20"
                />
              </div>
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  step="0.1"
                  {...mealForm.register("fat", { valueAsNumber: true })}
                  placeholder="15"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowAddMeal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addMealMutation.isPending}>
                {addMealMutation.isPending ? "Adding..." : "Add Meal"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Goals Modal */}
      <Dialog open={showGoalsModal} onOpenChange={setShowGoalsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Nutrition Goals</DialogTitle>
          </DialogHeader>
          <form onSubmit={goalsForm.handleSubmit((data) => updateGoalsMutation.mutate(data))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="daily-calories">Daily Calories</Label>
                <Input
                  id="daily-calories"
                  type="number"
                  {...goalsForm.register("dailyCalories", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="weight-goal">Weight Goal</Label>
                <Select value={goalsForm.watch("weightGoal")} onValueChange={(value) => goalsForm.setValue("weightGoal", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">Lose Weight</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                    <SelectItem value="gain">Gain Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="daily-protein">Daily Protein (g)</Label>
                <Input
                  id="daily-protein"
                  type="number"
                  step="0.1"
                  {...goalsForm.register("dailyProtein", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="daily-carbs">Daily Carbs (g)</Label>
                <Input
                  id="daily-carbs"
                  type="number"
                  step="0.1"
                  {...goalsForm.register("dailyCarbs", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label htmlFor="daily-fat">Daily Fat (g)</Label>
                <Input
                  id="daily-fat"
                  type="number"
                  step="0.1"
                  {...goalsForm.register("dailyFat", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowGoalsModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateGoalsMutation.isPending}>
                {updateGoalsMutation.isPending ? "Saving..." : "Save Goals"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}