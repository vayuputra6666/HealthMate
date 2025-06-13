import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { createWorkoutSchema, type CreateWorkout, type Exercise } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ExerciseEntry from "./exercise-entry";

interface NewWorkoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type WorkoutFormData = {
  name: string;
  date: string;
  duration: number;
  notes?: string;
  gender: "male" | "female";
  exercises: {
    exerciseId: number;
    sets: {
      weight?: string;
      reps?: number;
    }[];
  }[];
};

export default function NewWorkoutModal({ open, onOpenChange }: NewWorkoutModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [exercises, setExercises] = useState<WorkoutFormData["exercises"]>([
    {
      exerciseId: 0,
      sets: [{ weight: "", reps: 0 }],
    },
  ]);

  const { data: availableExercises = [] } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
    enabled: open,
  });

  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(createWorkoutSchema.omit({ exercises: true })),
    defaultValues: {
      name: "",
      date: new Date().toISOString().split("T")[0],
      duration: 60,
      notes: "",
      gender: "male",
    },
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (data: CreateWorkout) => {
      const response = await apiRequest("POST", "/api/workouts", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Workout created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create workout",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    form.reset({
      name: "",
      date: new Date().toISOString().split("T")[0],
      duration: 60,
      notes: "",
      gender: "male",
    });
    setExercises([{ exerciseId: 0, sets: [{ weight: "", reps: 0 }] }]);
    onOpenChange(false);
  };

  const addExercise = () => {
    setExercises([...exercises, { exerciseId: 0, sets: [{ weight: "", reps: 0 }] }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, exercise: WorkoutFormData["exercises"][0]) => {
    const newExercises = [...exercises];
    newExercises[index] = exercise;
    setExercises(newExercises);
  };

  const onSubmit = (data: WorkoutFormData) => {
    const validExercises = exercises.filter(
      (ex) => ex.exerciseId > 0 && ex.sets.some(set => set.weight || set.reps)
    );

    if (validExercises.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one exercise with sets",
        variant: "destructive",
      });
      return;
    }

    const workoutData: CreateWorkout = {
      ...data,
      date: new Date(data.date),
      gender: data.gender,
      exercises: validExercises,
    };

    createWorkoutMutation.mutate(workoutData);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>New Workout</DialogTitle>
          <DialogDescription>
            Create a new workout routine by selecting exercises and setting your goals.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="e.g., Push Day, Upper Body, etc."
                className="mt-1"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Exercises</Label>
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <ExerciseEntry
                    key={index}
                    exercise={exercise}
                    availableExercises={availableExercises}
                    onChange={(updatedExercise) => updateExercise(index, updatedExercise)}
                    onRemove={() => removeExercise(index)}
                    canRemove={exercises.length > 1}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addExercise}
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  {...form.register("date")}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  {...form.register("duration", { valueAsNumber: true })}
                  placeholder="45"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={form.watch("gender")} 
                  onValueChange={(value: "male" | "female") => form.setValue("gender", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                {...form.register("notes")}
                placeholder="Any additional notes about your workout..."
                className="mt-1 resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createWorkoutMutation.isPending}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                {createWorkoutMutation.isPending ? "Saving..." : "Save Workout"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}