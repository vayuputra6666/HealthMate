import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiErrorDisplay } from "@/components/ui/error-boundary";
import StatsGrid from "@/components/dashboard/stats-grid";
import RecentWorkouts from "@/components/dashboard/recent-workouts";
import QuickActions from "@/components/dashboard/quick-actions";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LoadingState } from "@/components/ui/loading";
import { TodaysMuscleActivation } from "@/components/body-visualization/todays-muscle-activation";
import NewWorkoutModal from "@/components/workout/new-workout-modal";
export default function Dashboard() {
  const [showNewWorkoutModal, setShowNewWorkoutModal] = useState(false);
    const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) {
        throw new Error(`Failed to fetch stats: ${res.status}`);
      }
      return res.json();
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: workouts, isLoading: workoutsLoading, error: workoutsError } = useQuery({
    queryKey: ["/api/workouts"],
    queryFn: async () => {
      const res = await fetch("/api/workouts");
      if (!res.ok) {
        throw new Error(`Failed to fetch workouts: ${res.status}`);
      }
      return res.json();
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  if (statsLoading || workoutsLoading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  if (statsError || workoutsError) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            Error loading dashboard: {statsError?.message || workoutsError?.message}
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <Button 
          onClick={() => setShowNewWorkoutModal(true)}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Workout
        </Button>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
        <div className="xl:col-span-2">
          <TodaysMuscleActivation />
        </div>
        <div className="xl:col-span-2">
          <RecentWorkouts workouts={workouts} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <QuickActions />
      </div>

      <NewWorkoutModal 
        open={showNewWorkoutModal} 
        onClose={() => setShowNewWorkoutModal(false)} 
      />
    </div>
  );
}