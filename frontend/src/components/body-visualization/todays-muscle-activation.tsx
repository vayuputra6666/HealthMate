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

  const getActivatedMuscles = () => {
    if (!todaysWorkouts || todaysWorkouts.length === 0) return [];

    const muscleActivations: MuscleActivation[] = [];
    const muscleMap = new Map();

    todaysWorkouts.forEach((workout: any) => {
      workout.exercises?.forEach((exercise: any) => {
        const exerciseName = exercise.name?.toLowerCase() || '';

        // Map exercises to muscles with intensity
        const muscles = [];
        if (exerciseName.includes('chest') || exerciseName.includes('bench')) {
          muscles.push({ muscle: 'Chest', intensity: 'high' });
        }
        if (exerciseName.includes('back') || exerciseName.includes('row') || exerciseName.includes('pull')) {
          muscles.push({ muscle: 'Back', intensity: 'high' });
        }
        if (exerciseName.includes('shoulder') || exerciseName.includes('press')) {
          muscles.push({ muscle: 'Shoulders', intensity: 'medium' });
        }
        if (exerciseName.includes('bicep') || exerciseName.includes('curl')) {
          muscles.push({ muscle: 'Biceps', intensity: 'medium' });
        }
        if (exerciseName.includes('tricep')) {
          muscles.push({ muscle: 'Triceps', intensity: 'medium' });
        }
        if (exerciseName.includes('leg') || exerciseName.includes('squat')) {
          muscles.push({ muscle: 'Legs', intensity: 'high' });
        }
        if (exerciseName.includes('core') || exerciseName.includes('ab')) {
          muscles.push({ muscle: 'Core', intensity: 'medium' });
        }

        muscles.forEach(({ muscle, intensity }) => {
          if (!muscleMap.has(muscle)) {
            muscleMap.set(muscle, { muscle, intensity, exercises: [] });
          }
          muscleMap.get(muscle).exercises.push(exercise.name);
        });
      });
    });

    return Array.from(muscleMap.values());
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const muscleActivations = getActivatedMuscles();

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
                  {activation.exercises.slice(0, 2).join(", ")}
                  {activation.exercises.length > 2 ? "..." : ""}
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