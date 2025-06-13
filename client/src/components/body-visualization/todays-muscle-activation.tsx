import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import MuscleMap from "./muscle-map";
import type { WorkoutWithExercises, Exercise } from "@shared/schema";

export default function TodaysMuscleActivation() {
  const [selectedGender, setSelectedGender] = useState<"male" | "female">("male");

  const { data: workouts = [] } = useQuery<WorkoutWithExercises[]>({
    queryKey: ["/api/workouts"],
  });

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  // Get today's workouts
  const today = new Date().toISOString().split("T")[0];
  const todaysWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date).toISOString().split("T")[0];
    return workoutDate === today;
  });

  // Get all muscle groups trained today
  const trainedMuscles = new Set<string>();
  todaysWorkouts.forEach(workout => {
    workout.exercises?.forEach(workoutExercise => {
      const exercise = exercises.find(ex => ex.id === workoutExercise.exerciseId);
      if (exercise?.muscleGroups) {
        exercise.muscleGroups.forEach(muscle => trainedMuscles.add(muscle));
      }
    });
  });

  const trainedMusclesList = Array.from(trainedMuscles);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Today's Muscle Activation
          </CardTitle>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <Select value={selectedGender} onValueChange={(value: "male" | "female") => setSelectedGender(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {todaysWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <MuscleMap
                  gender={selectedGender}
                  highlightedMuscles={[]}
                  className="max-w-sm mx-auto opacity-50"
                />
              </div>
              <p className="text-gray-500 text-base font-medium mb-2">No workouts completed today</p>
              <p className="text-gray-400 text-sm">Complete a workout to see muscle activation</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Muscle Map */}
              <div className="flex flex-col items-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Muscle Activation Map
                </h4>
                <MuscleMap
                  gender={selectedGender}
                  highlightedMuscles={trainedMusclesList}
                  className="max-w-sm mx-auto"
                />
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {trainedMusclesList.length} muscle groups activated
                  </div>
                </div>
              </div>
              
              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    🎯 Muscles Trained Today
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {trainedMusclesList.length}
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {trainedMusclesList.map(muscle => (
                      <div
                        key={muscle}
                        className="flex items-center px-3 py-2 rounded-lg bg-red-50 border border-red-100"
                      >
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-red-900">
                          {muscle.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    💪 Today's Sessions
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {todaysWorkouts.length}
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {todaysWorkouts.map(workout => (
                      <div key={workout.id} className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                        <div className="font-semibold text-gray-900 mb-1">{workout.name}</div>
                        <div className="flex items-center text-xs text-gray-500 space-x-3">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                            {workout.exercises?.length || 0} exercises
                          </span>
                          {workout.duration && (
                            <span className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                              {workout.duration} min
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}