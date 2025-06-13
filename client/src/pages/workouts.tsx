import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Dumbbell, Plus, TrendingUp } from "lucide-react";
import NewWorkoutModal from "@/components/workout/new-workout-modal";
import { LoadingState, EmptyState } from "@/components/ui/loading";

interface Workout {
  id: number;
  name: string;
  date: string;
  duration: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }>;
  notes?: string;
}

export default function Workouts() {
  const [showNewWorkout, setShowNewWorkout] = useState(false);
  const queryClient = useQueryClient();

  const { data: workouts, isLoading } = useQuery({
    queryKey: ["/api/workouts"],
    queryFn: () => fetch("/api/workouts").then((res) => res.json()),
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!workouts || workouts.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Workouts</h1>
            <p className="text-muted-foreground mt-2">Track and manage your workout sessions</p>
          </div>
          <Button onClick={() => setShowNewWorkout(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Workout
          </Button>
        </div>

        <EmptyState
          title="No workouts yet"
          description="Start your fitness journey by creating your first workout session."
          icon={<Dumbbell className="w-12 h-12" />}
          action={
            <Button onClick={() => setShowNewWorkout(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Workout
            </Button>
          }
        />

        <NewWorkoutModal
          open={showNewWorkout}
          onOpenChange={setShowNewWorkout}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Workouts</h1>
          <p className="text-muted-foreground mt-2">Track and manage your workout sessions</p>
        </div>
        <Button onClick={() => setShowNewWorkout(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Workout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader>
              <CardTitle>{workout.name}</CardTitle>
              <CardDescription>{workout.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Duration: {workout.duration} minutes</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewWorkoutModal
        open={showNewWorkout}
        onOpenChange={setShowNewWorkout}
      />
    </div>
  );
}
```