
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Dumbbell, Search, Trash2, Eye, Filter } from "lucide-react";
import { LoadingState, EmptyState } from "@/components/ui/loading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface WorkoutWithExercises {
  id: number;
  name: string;
  date: string;
  duration: number;
  notes?: string;
  exercises: Array<{
    exercise: { name: string; category: string };
    sets: Array<{
      weight: string;
      reps: number;
      completed: number;
    }>;
  }>;
}

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workouts, isLoading } = useQuery({
    queryKey: ["/api/workouts"],
    queryFn: () => fetch("/api/workouts").then((res) => res.json()),
  });

  const deleteWorkoutMutation = useMutation({
    mutationFn: async (workoutId: number) => {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete workout");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ title: "Workout deleted successfully!" });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to delete workout. Please try again.",
        variant: "destructive"
      });
    },
  });

  // Filter workouts based on search and filters
  const filteredWorkouts = workouts?.filter((workout: WorkoutWithExercises) => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.exercises?.some(ex => ex.exercise?.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || 
      workout.exercises?.some(ex => ex.exercise?.category === selectedCategory);

    let matchesTimeframe = true;
    if (selectedTimeframe !== "all") {
      const workoutDate = new Date(workout.date);
      const now = new Date();
      
      switch (selectedTimeframe) {
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesTimeframe = workoutDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesTimeframe = workoutDate >= monthAgo;
          break;
        case "3months":
          const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          matchesTimeframe = workoutDate >= threeMonthsAgo;
          break;
      }
    }

    return matchesSearch && matchesCategory && matchesTimeframe;
  }) || [];

  // Get unique categories from workouts
  const categories = [...new Set(
    workouts?.flatMap((workout: WorkoutWithExercises) => 
      workout.exercises?.map(ex => ex.exercise?.category) || []
    ) || []
  )];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalVolume = (workout: WorkoutWithExercises) => {
    let totalVolume = 0;
    workout.exercises?.forEach(exercise => {
      exercise.sets?.forEach(set => {
        if (set.weight && set.reps && set.completed) {
          totalVolume += parseFloat(set.weight) * set.reps;
        }
      });
    });
    return Math.round(totalVolume);
  };

  const calculateTotalSets = (workout: WorkoutWithExercises) => {
    return workout.exercises?.reduce((total, exercise) => 
      total + (exercise.sets?.filter(set => set.completed).length || 0), 0
    ) || 0;
  };

  if (isLoading) {
    return <LoadingState message="Loading workout history..." />;
  }

  if (!workouts || workouts.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Workout History</h1>
          <p className="text-muted-foreground mt-2">View and manage your past workout sessions</p>
        </div>
        
        <EmptyState
          title="No workout history yet"
          description="Start working out to build your fitness history and track your progress."
          icon={<Dumbbell className="w-12 h-12" />}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Workout History</h1>
        <p className="text-muted-foreground mt-2">View and manage your past workout sessions</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredWorkouts.length} of {workouts.length} workouts
        </p>
      </div>

      {/* Workout List */}
      {filteredWorkouts.length === 0 ? (
        <EmptyState
          title="No workouts found"
          description="Try adjusting your search terms or filters to find workouts."
          icon={<Search className="w-8 h-8" />}
          action={
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedTimeframe("all");
              }}
            >
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredWorkouts.map((workout) => (
            <Card key={workout.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{workout.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(workout.date)}
                        </span>
                        {workout.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {workout.duration} min
                          </span>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{workout.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Date:</span> {formatDate(workout.date)}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {workout.duration || 'Not tracked'} min
                            </div>
                            <div>
                              <span className="font-medium">Total Sets:</span> {calculateTotalSets(workout)}
                            </div>
                            <div>
                              <span className="font-medium">Total Volume:</span> {calculateTotalVolume(workout)} lbs
                            </div>
                          </div>
                          
                          {workout.notes && (
                            <div>
                              <span className="font-medium">Notes:</span>
                              <p className="text-sm text-muted-foreground mt-1">{workout.notes}</p>
                            </div>
                          )}

                          <div className="space-y-4">
                            <h4 className="font-medium">Exercises</h4>
                            {workout.exercises?.map((exercise, index) => (
                              <div key={index} className="border rounded p-3">
                                <h5 className="font-medium">{exercise.exercise?.name}</h5>
                                <Badge variant="outline" className="mt-1 mb-2">
                                  {exercise.exercise?.category}
                                </Badge>
                                <div className="space-y-1">
                                  {exercise.sets?.map((set, setIndex) => (
                                    <div key={setIndex} className="flex justify-between text-sm">
                                      <span>Set {setIndex + 1}:</span>
                                      <span>
                                        {set.weight} lbs × {set.reps} reps
                                        {!set.completed && (
                                          <Badge variant="destructive" className="ml-2 text-xs">
                                            Incomplete
                                          </Badge>
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Workout</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{workout.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteWorkoutMutation.mutate(workout.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Exercises:</span>
                    <div className="font-medium">{workout.exercises?.length || 0}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Sets:</span>
                    <div className="font-medium">{calculateTotalSets(workout)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Volume:</span>
                    <div className="font-medium">{calculateTotalVolume(workout)} lbs</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Categories:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {[...new Set(workout.exercises?.map(ex => ex.exercise?.category) || [])].map(category => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {workout.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-muted-foreground text-sm">Notes:</span>
                    <p className="text-sm mt-1">{workout.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
