import { useQuery } from "@tanstack/react-query";
import { Dumbbell, Activity } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import type { Workout } from "@shared/schema";

export default function RecentWorkouts() {
  const { data: workouts = [], isLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const recentWorkouts = workouts.slice(0, 3);

  const formatDate = (date: Date | string) => {
    const workoutDate = new Date(date);
    if (isToday(workoutDate)) {
      return `Today, ${format(workoutDate, "h:mm a")}`;
    } else if (isYesterday(workoutDate)) {
      return `Yesterday, ${format(workoutDate, "h:mm a")}`;
    }
    return format(workoutDate, "MMM d, h:mm a");
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Workouts</h3>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">View all</a>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="ml-3">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Workouts</h3>
          <a href="/workouts" className="text-sm text-gray-500 hover:text-gray-900">View all</a>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {recentWorkouts.length === 0 ? (
          <div className="text-center py-8">
            <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No workouts yet</p>
            <p className="text-gray-400 text-xs">Start your first workout to see it here</p>
          </div>
        ) : (
          recentWorkouts.map((workout) => (
            <div key={workout.id} className="workout-card flex items-center justify-between p-4 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Activity className="text-gray-600 w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{workout.name}</p>
                  <p className="text-xs text-gray-500">{formatDate(workout.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {workout.duration ? `${workout.duration} min` : "N/A"}
                </p>
                <p className="text-xs text-gray-500">workout</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
