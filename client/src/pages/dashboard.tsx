import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import StatsGrid from "@/components/dashboard/stats-grid";
import RecentWorkouts from "@/components/dashboard/recent-workouts";
import QuickActions from "@/components/dashboard/quick-actions";
import NewWorkoutModal from "@/components/workout/new-workout-modal";
import TodaysMuscleActivation from "@/components/body-visualization/todays-muscle-activation";

export default function Dashboard() {
  const [showNewWorkoutModal, setShowNewWorkoutModal] = useState(false);

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

      <StatsGrid />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
        <div className="xl:col-span-2">
          <TodaysMuscleActivation />
        </div>
        <div className="xl:col-span-2">
          <RecentWorkouts />
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
