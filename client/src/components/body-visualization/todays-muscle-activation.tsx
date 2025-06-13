import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Target } from "lucide-react";

interface MuscleActivation {
  muscle: string;
  intensity: "low" | "medium" | "high";
  exercises: string[];
}

export function TodaysMuscleActivation() {
  const { data: todaysWorkouts, isLoading } = useQuery({
    queryKey: ["/api/workouts/today"],
  });

  // Mock data for now since we don't have today's workout endpoint
  const muscleActivations: MuscleActivation[] = [
    { muscle: "Chest", intensity: "high", exercises: ["Bench Press", "Push-ups"] },
    { muscle: "Triceps", intensity: "medium", exercises: ["Bench Press", "Dips"] },
    { muscle: "Shoulders", intensity: "low", exercises: ["Push-ups"] },
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Today's Muscle Activation
        </CardTitle>
        <CardDescription>
          Muscles targeted in today's workout
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : muscleActivations.length > 0 ? (
          <div className="space-y-3">
            {muscleActivations.map((activation, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activation.muscle}</span>
                  <Badge 
                    variant="secondary" 
                    className={getIntensityColor(activation.intensity)}
                  >
                    {activation.intensity}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  {activation.exercises.join(", ")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No workout completed today</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TodaysMuscleActivation;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export function TodaysMuscleActivation() {
  const { data: todaysWorkouts, isLoading } = useQuery({
    queryKey: ["/api/workouts/today"],
    queryFn: async () => {
      const res = await fetch("/api/workouts/today");
      if (!res.ok) {
        throw new Error(`Failed to fetch today's workouts: ${res.status}`);
      }
      return res.json();
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Muscle Activation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivatedMuscles = () => {
    if (!todaysWorkouts || todaysWorkouts.length === 0) return [];
    
    const muscles = new Set();
    todaysWorkouts.forEach((workout: any) => {
      workout.exercises?.forEach((exercise: any) => {
        // Add basic muscle mapping based on exercise names
        const exerciseName = exercise.name?.toLowerCase() || '';
        if (exerciseName.includes('chest') || exerciseName.includes('bench')) muscles.add('Chest');
        if (exerciseName.includes('back') || exerciseName.includes('row')) muscles.add('Back');
        if (exerciseName.includes('shoulder') || exerciseName.includes('press')) muscles.add('Shoulders');
        if (exerciseName.includes('bicep') || exerciseName.includes('curl')) muscles.add('Biceps');
        if (exerciseName.includes('tricep')) muscles.add('Triceps');
        if (exerciseName.includes('leg') || exerciseName.includes('squat')) muscles.add('Legs');
        if (exerciseName.includes('core') || exerciseName.includes('ab')) muscles.add('Core');
      });
    });
    return Array.from(muscles);
  };

  const activatedMuscles = getActivatedMuscles();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Muscle Activation</CardTitle>
      </CardHeader>
      <CardContent>
        {todaysWorkouts && todaysWorkouts.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Workouts completed: {todaysWorkouts.length}
            </div>
            
            {activatedMuscles.length > 0 ? (
              <div>
                <h4 className="font-medium mb-2">Muscles Targeted:</h4>
                <div className="flex flex-wrap gap-2">
                  {activatedMuscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Complete a workout to see muscle activation
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-gray-500">No workouts completed today</p>
            <p className="text-sm text-gray-400">Start a workout to track your progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
