import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, Clock, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import NewWorkoutModal from "@/components/workout/new-workout-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Workout } from "@shared/schema";

export default function Workouts() {
  const [showNewWorkoutModal, setShowNewWorkoutModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workouts = [], isLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const deleteWorkoutMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/workouts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Workout deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete workout",
        variant: "destructive",
      });
    },
  });

  const handleDeleteWorkout = (id: number) => {
    if (confirm("Are you sure you want to delete this workout?")) {
      deleteWorkoutMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Workouts</h2>
          <Button className="bg-gray-900 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Workout
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Workouts</h2>
        <Button 
          onClick={() => setShowNewWorkoutModal(true)}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Workout
        </Button>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts yet</h3>
          <p className="text-gray-500 mb-6">Create your first workout to get started</p>
          <Button 
            onClick={() => setShowNewWorkoutModal(true)}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Workout
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <Card key={workout.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {workout.name}
                    </CardTitle>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(workout.date), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWorkout(workout.id)}
                      disabled={deleteWorkoutMutation.isPending}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {workout.duration && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {workout.duration} minutes
                    </div>
                  )}
                  {workout.notes && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {workout.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NewWorkoutModal 
        open={showNewWorkoutModal} 
        onClose={() => setShowNewWorkoutModal(false)} 
      />
    </div>
  );
}
