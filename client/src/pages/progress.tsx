
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProgressData {
  id: number;
  date: string;
  weight: number;
  bodyFat: number;
  muscle: number;
  measurements: {
    chest: number;
    waist: number;
    arms: number;
    thighs: number;
  };
}

interface WorkoutProgress {
  exercise: string;
  previousWeight: number;
  currentWeight: number;
  improvement: number;
}

export default function ProgressPage() {
  const { data: progressData, isLoading } = useQuery<ProgressData[]>({
    queryKey: ["/api/progress"],
    queryFn: async () => {
      const response = await fetch("/api/progress");
      if (!response.ok) {
        throw new Error("Failed to fetch progress data");
      }
      return response.json();
    },
  });

  const workoutProgress: WorkoutProgress[] = [
    { exercise: "Bench Press", previousWeight: 185, currentWeight: 205, improvement: 10.8 },
    { exercise: "Squat", previousWeight: 225, currentWeight: 255, improvement: 13.3 },
    { exercise: "Deadlift", previousWeight: 275, currentWeight: 315, improvement: 14.5 },
    { exercise: "Overhead Press", previousWeight: 115, currentWeight: 135, improvement: 17.4 },
  ];

  const currentStats = {
    weight: 180,
    bodyFat: 12.5,
    muscle: 157.5,
    weeklyGoal: 4,
    workoutsCompleted: 3,
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Progress Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Progress Tracking</h2>
        <Badge variant="outline" className="text-green-600 border-green-600">
          This Week: {currentStats.workoutsCompleted}/{currentStats.weeklyGoal} Workouts
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="body">Body Stats</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Weight</CardTitle>
                <CardDescription>Last updated today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{currentStats.weight} lbs</div>
                <div className="text-sm text-green-600 mt-2">+2.5 lbs from last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Body Fat %</CardTitle>
                <CardDescription>Estimated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{currentStats.bodyFat}%</div>
                <div className="text-sm text-green-600 mt-2">-0.8% from last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Muscle Mass</CardTitle>
                <CardDescription>Estimated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{currentStats.muscle} lbs</div>
                <div className="text-sm text-green-600 mt-2">+3.2 lbs from last month</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Workout Progress</CardTitle>
              <CardDescription>Track your consistency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">This Week</span>
                  <span className="text-sm text-gray-500">{currentStats.workoutsCompleted}/{currentStats.weeklyGoal}</span>
                </div>
                <Progress value={(currentStats.workoutsCompleted / currentStats.weeklyGoal) * 100} />
                <div className="text-sm text-gray-600">
                  {currentStats.weeklyGoal - currentStats.workoutsCompleted} workout{currentStats.weeklyGoal - currentStats.workoutsCompleted !== 1 ? 's' : ''} remaining this week
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strength" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strength Progress</CardTitle>
              <CardDescription>Your lifting improvements over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {workoutProgress.map((exercise) => (
                  <div key={exercise.exercise} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{exercise.exercise}</span>
                      <Badge variant="secondary" className="text-green-600">
                        +{exercise.improvement}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Previous: {exercise.previousWeight} lbs</span>
                      <span>Current: {exercise.currentWeight} lbs</span>
                    </div>
                    <Progress value={exercise.improvement * 5} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="body" className="space-y-6">
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Body Composition Tracking</h3>
            <p className="text-gray-600 mb-4">
              Detailed body composition analysis and progress charts coming soon!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline">Weight Trends</Badge>
              <Badge variant="outline">Body Fat Analysis</Badge>
              <Badge variant="outline">Muscle Growth</Badge>
              <Badge variant="outline">Progress Photos</Badge>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-6">
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-4xl mb-4">📏</div>
            <h3 className="text-lg font-semibold mb-2">Body Measurements</h3>
            <p className="text-gray-600 mb-4">
              Track chest, waist, arms, and other measurements over time.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline">Chest</Badge>
              <Badge variant="outline">Waist</Badge>
              <Badge variant="outline">Arms</Badge>
              <Badge variant="outline">Thighs</Badge>
              <Badge variant="outline">Neck</Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
