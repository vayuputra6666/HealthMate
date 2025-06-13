import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Dumbbell, TrendingUp, History } from "lucide-react";
import { LoadingState, EmptyState } from "@/components/ui/loading";

interface WorkoutHistory {
  id: number;
  name: string;
  date: string;
  duration: number;
  exercises: number;
  totalVolume: number;
  notes?: string;
}

export default function HistoryPage() {
  const { data: workoutHistory, isLoading, error } = useQuery({
    queryKey: ["/api/workout-history"],
    queryFn: () => fetch("/api/workout-history").then((res) => res.json()),
  });

  if (isLoading) {
    return <LoadingState message="Loading workout history..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load workout history"
        description="There was an error loading your workout history. Please try again."
        icon={<Dumbbell className="w-12 h-12" />}
        action={<Button onClick={() => window.location.reload()}>Retry</Button>}
      />
    );
  }

  if (!workoutHistory || workoutHistory.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Workout History</h1>
          <p className="text-muted-foreground mt-2">Track your fitness journey over time</p>
        </div>

        <EmptyState
          title="No workout history yet"
          description="Complete your first workout to start building your fitness history."
          icon={<TrendingUp className="w-12 h-12" />}
          action={
            <Button onClick={() => window.location.href = "/workouts"}>
              Start Your First Workout
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Workout History</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Filter by Date
          </Button>
          <Button variant="outline" size="sm">
            Export Data
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {workoutHistory.map((workout) => (
          <Card key={workout.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{workout.name}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(workout.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(workout.duration)}
                    </span>
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  Repeat Workout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {workout.exercises} exercises
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {workout.totalVolume.toLocaleString()} lbs total volume
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {workout.duration > 80 ? "Long" : workout.duration > 60 ? "Medium" : "Short"} Session
                  </Badge>
                </div>
              </div>

              {workout.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <strong>Notes:</strong> {workout.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="text-gray-500 text-sm mb-4">
          Showing last 5 workouts
        </div>
        <Button variant="outline">
          Load More History
        </Button>
      </div>
    </div>
  );
}

const mockHistory: WorkoutHistory[] = [
  {
    id: 1,
    name: "Push Day",
    date: "2024-01-15",
    duration: 75,
    exercises: 6,
    totalVolume: 12500,
    notes: "Great session, felt strong on bench press"
  },
  {
    id: 2,
    name: "Pull Day",
    date: "2024-01-13",
    duration: 68,
    exercises: 5,
    totalVolume: 11200,
  },
  {
    id: 3,
    name: "Leg Day",
    date: "2024-01-11",
    duration: 82,
    exercises: 7,
    totalVolume: 15300,
    notes: "New PR on squats!"
  },
  {
    id: 4,
    name: "Upper Body",
    date: "2024-01-09",
    duration: 70,
    exercises: 6,
    totalVolume: 10800,
  },
  {
    id: 5,
    name: "Full Body",
    date: "2024-01-07",
    duration: 90,
    exercises: 8,
    totalVolume: 13600,
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};