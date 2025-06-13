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