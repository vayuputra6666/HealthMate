import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Dumbbell, Plus } from "lucide-react";
import { LoadingSpinner, EmptyState } from "@/components/ui/loading";

interface RecentWorkoutsProps {
  workouts?: any[];
}

export default function RecentWorkouts({ workouts }: RecentWorkoutsProps) {

  const recentWorkouts = workouts?.slice(0, 3) || [];

  if (recentWorkouts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Recent Workouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No workouts yet"
            description="Start your fitness journey today!"
            icon={<Dumbbell className="w-8 h-8" />}
            action={
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Workout
              </Button>
            }
            className="py-4"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5" />
          Recent Workouts
        </CardTitle>
        <CardDescription>Your last 3 workouts</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {recentWorkouts.map((workout) => (
          <div key={workout.id} className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{workout.name}</p>
              <p className="text-sm text-muted-foreground">
                {workout.exercises.length} exercises
              </p>
            </div>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}