
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Target, Award, Calendar, Weight, Dumbbell } from "lucide-react";
import { LoadingState, EmptyState } from "@/components/ui/loading";

export default function Progress() {
  const { data: workouts, isLoading: workoutsLoading } = useQuery({
    queryKey: ["/api/workouts"],
    queryFn: () => fetch("/api/workouts").then((res) => res.json()),
  });

  const { data: weightData, isLoading: weightLoading } = useQuery({
    queryKey: ["/api/weight"],
    queryFn: () => fetch("/api/weight").then((res) => res.json()),
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => fetch("/api/stats").then((res) => res.json()),
  });

  // Calculate workout frequency (last 30 days)
  const calculateWorkoutFrequency = () => {
    if (!workouts) return [];
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentWorkouts = workouts.filter((workout: any) => 
      new Date(workout.date) >= thirtyDaysAgo
    );

    const frequencyData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayWorkouts = recentWorkouts.filter((workout: any) => 
        new Date(workout.date).toDateString() === date.toDateString()
      );
      
      frequencyData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        workouts: dayWorkouts.length,
      });
    }
    
    return frequencyData;
  };

  // Calculate strength progress
  const calculateStrengthProgress = () => {
    if (!workouts) return [];

    const exerciseMaxes: { [key: string]: { weight: number; date: string }[] } = {};
    
    workouts.forEach((workout: any) => {
      workout.exercises?.forEach((exercise: any) => {
        const exerciseName = exercise.exercise?.name || 'Unknown Exercise';
        if (!exerciseMaxes[exerciseName]) {
          exerciseMaxes[exerciseName] = [];
        }
        
        exercise.sets?.forEach((set: any) => {
          if (set.weight && set.reps) {
            exerciseMaxes[exerciseName].push({
              weight: parseFloat(set.weight),
              date: workout.date
            });
          }
        });
      });
    });

    return Object.entries(exerciseMaxes)
      .map(([exercise, records]) => {
        if (records.length < 2) return null;
        
        records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const firstRecord = records[0];
        const lastRecord = records[records.length - 1];
        const improvement = ((lastRecord.weight - firstRecord.weight) / firstRecord.weight) * 100;
        
        return {
          exercise,
          previousWeight: firstRecord.weight,
          currentWeight: lastRecord.weight,
          improvement: Math.round(improvement * 10) / 10,
          totalSessions: records.length
        };
      })
      .filter(Boolean)
      .sort((a, b) => (b?.improvement || 0) - (a?.improvement || 0))
      .slice(0, 6);
  };

  // Calculate volume progression
  const calculateVolumeProgression = () => {
    if (!workouts) return [];

    const last12Weeks = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekWorkouts = workouts.filter((workout: any) => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
      });

      let totalVolume = 0;
      weekWorkouts.forEach((workout: any) => {
        workout.exercises?.forEach((exercise: any) => {
          exercise.sets?.forEach((set: any) => {
            if (set.weight && set.reps) {
              totalVolume += parseFloat(set.weight) * set.reps;
            }
          });
        });
      });

      last12Weeks.push({
        week: `Week ${12 - i}`,
        volume: Math.round(totalVolume),
        workouts: weekWorkouts.length
      });
    }

    return last12Weeks;
  };

  const workoutFrequency = calculateWorkoutFrequency();
  const strengthProgress = calculateStrengthProgress();
  const volumeProgression = calculateVolumeProgression();

  const weightProgress = weightData?.map((entry: any) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: parseFloat(entry.weight),
  })) || [];

  if (workoutsLoading || weightLoading) {
    return <LoadingState message="Loading progress data..." />;
  }

  if (!workouts || workouts.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Progress</h1>
          <p className="text-muted-foreground mt-2">Track your fitness journey and improvements</p>
        </div>
        
        <EmptyState
          title="No progress data yet"
          description="Start logging workouts to see your progress and improvements over time."
          icon={<TrendingUp className="w-12 h-12" />}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Progress</h1>
        <p className="text-muted-foreground mt-2">Track your fitness journey and improvements</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Dumbbell className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workouts.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workouts.filter((w: any) => {
                const workoutDate = new Date(w.date);
                const thisMonth = new Date();
                return workoutDate.getMonth() === thisMonth.getMonth() && 
                       workoutDate.getFullYear() === thisMonth.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Workouts completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
            <Weight className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weightData && weightData.length > 0 
                ? `${weightData[weightData.length - 1].weight} ${weightData[weightData.length - 1].unit}`
                : 'No data'
              }
            </div>
            <p className="text-xs text-muted-foreground">Latest entry</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
            <Award className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Days in a row</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="strength" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="frequency">Frequency</TabsTrigger>
        </TabsList>

        <TabsContent value="strength" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strength Progress</CardTitle>
              <CardDescription>Your lifting improvements over time</CardDescription>
            </CardHeader>
            <CardContent>
              {strengthProgress.length > 0 ? (
                <div className="space-y-6">
                  {strengthProgress.map((exercise) => (
                    <div key={exercise.exercise} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{exercise.exercise}</span>
                        <Badge variant={exercise.improvement > 0 ? "default" : "secondary"} className="text-green-600">
                          {exercise.improvement > 0 ? '+' : ''}{exercise.improvement}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Previous: {exercise.previousWeight} lbs</span>
                        <span>Current: {exercise.currentWeight} lbs</span>
                      </div>
                      <ProgressBar value={Math.min(Math.abs(exercise.improvement) * 2, 100)} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No strength data yet"
                  description="Complete more workouts with the same exercises to see strength progress."
                  icon={<TrendingUp className="w-8 h-8" />}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Progress</CardTitle>
              <CardDescription>Your weight changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              {weightProgress.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  title="No weight data yet"
                  description="Start tracking your weight to see progress over time."
                  icon={<Weight className="w-8 h-8" />}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Volume</CardTitle>
              <CardDescription>Your weekly training volume progression</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeProgression}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frequency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Frequency</CardTitle>
              <CardDescription>Your daily workout consistency (last 30 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workoutFrequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="workouts" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
