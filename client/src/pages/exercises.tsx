import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExerciseSchema, type Exercise, type InsertExercise } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Exercises() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: exercises = [], isLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const form = useForm<InsertExercise>({
    resolver: zodResolver(insertExerciseSchema),
    defaultValues: {
      name: "",
      category: "",
      instructions: "",
      muscleGroups: [],
    },
  });

  const createExerciseMutation = useMutation({
    mutationFn: async (data: InsertExercise) => {
      const response = await apiRequest("POST", "/api/exercises", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Exercise created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/exercises"] });
      form.reset();
      setShowCreateModal(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create exercise",
        variant: "destructive",
      });
    },
  });

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exercisesByCategory = filteredExercises.reduce((acc, exercise) => {
    const category = exercise.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  const onSubmit = (data: InsertExercise) => {
    createExerciseMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Exercises</h2>
          <Button className="bg-gray-900 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Exercise
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
                <div className="h-16 bg-gray-200 rounded"></div>
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
        <h2 className="text-xl font-semibold text-gray-900">Exercises</h2>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Exercises by Category */}
      {Object.entries(exercisesByCategory).map(([category, categoryExercises]) => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
            {category} ({categoryExercises.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryExercises.map((exercise) => (
              <Card key={exercise.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-medium text-gray-900">
                      {exercise.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {exercise.category}
                    </Badge>
                  </div>
                </CardHeader>
                {exercise.instructions && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {exercise.instructions}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No exercises found" : "No exercises yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? "Try adjusting your search terms" 
              : "Add your first exercise to get started"
            }
          </p>
          {!searchTerm && (
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Exercise
            </Button>
          )}
        </div>
      )}

      {/* Create Exercise Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Exercise</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Exercise Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="e.g., Bench Press"
                className="mt-1"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...form.register("category")}
                placeholder="e.g., chest, legs, back"
                className="mt-1"
              />
              {form.formState.errors.category && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="muscleGroups">Muscle Groups (Optional)</Label>
              <Input
                id="muscleGroups"
                placeholder="e.g., chest, triceps, shoulders (comma separated)"
                onChange={(e) => {
                  const muscles = e.target.value.split(',').map(m => m.trim()).filter(m => m);
                  form.setValue("muscleGroups", muscles);
                }}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple muscle groups with commas
              </p>
            </div>

            <div>
              <Label htmlFor="instructions">Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                {...form.register("instructions")}
                placeholder="How to perform this exercise..."
                className="mt-1 resize-none"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createExerciseMutation.isPending}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                {createExerciseMutation.isPending ? "Adding..." : "Add Exercise"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
