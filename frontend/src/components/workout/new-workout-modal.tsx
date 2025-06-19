import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface NewWorkoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WorkoutExercise {
  exerciseId: string;
  sets: Array<{
    weight: string;
    reps: number;
    completed: boolean;
  }>;
}

interface WorkoutForm {
  name: string;
  date: string;
  duration: number;
  notes: string;
  exercises: WorkoutExercise[];
}

export default function NewWorkoutModal({ open, onOpenChange }: NewWorkoutModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

  const form = useForm<WorkoutForm>({
    defaultValues: {
      name: "",
      date: new Date().toISOString().split('T')[0],
      duration: 0,
      notes: "",
      exercises: [],
    },
  });

  const { data: availableExercises } = useQuery({
    queryKey: ["/api/exercises"],
    queryFn: () => fetch("/api/exercises").then((res) => res.json()),
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (data: WorkoutForm) => {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          exercises: exercises,
        }),
      });
      if (!response.ok) throw new Error("Failed to create workout");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({ title: "Workout created successfully!" });
      onOpenChange(false);
      form.reset();
      setExercises([]);
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to create workout. Please try again.",
        variant: "destructive"
      });
    },
  });

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        exerciseId: "",
        sets: [{ weight: "", reps: 0, completed: false }],
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, exerciseId: string) => {
    const updated = [...exercises];
    updated[index].exerciseId = exerciseId;
    setExercises(updated);
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets.push({ weight: "", reps: 0, completed: false });
    setExercises(updated);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: any) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex] = {
      ...updated[exerciseIndex].sets[setIndex],
      [field]: value,
    };
    setExercises(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setExercises(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workout</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit((data) => createWorkoutMutation.mutate(data))} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                {...form.register("name", { required: true })}
                placeholder="e.g., Upper Body Strength"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...form.register("date", { required: true })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              {...form.register("duration", { valueAsNumber: true })}
              placeholder="60"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="How did the workout feel? Any observations..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Exercises</Label>
              <Button type="button" onClick={addExercise} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Exercise
              </Button>
            </div>

            {exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Select
                    value={exercise.exerciseId}
                    onValueChange={(value) => updateExercise(exerciseIndex, value)}
                  >
                    <SelectTrigger className="flex-1 mr-2">
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableExercises?.map((ex: any) => (
                        <SelectItem key={ex.id} value={ex.id.toString()}>
                          {ex.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => removeExercise(exerciseIndex)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm">Sets</Label>
                    <Button
                      type="button"
                      onClick={() => addSet(exerciseIndex)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Set
                    </Button>
                  </div>

                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex gap-2 items-center">
                      <span className="text-sm text-muted-foreground w-8">
                        {setIndex + 1}
                      </span>
                      <Input
                        placeholder="Weight"
                        value={set.weight}
                        onChange={(e) =>
                          updateSet(exerciseIndex, setIndex, "weight", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Input
                        placeholder="Reps"
                        type="number"
                        value={set.reps || ""}
                        onChange={(e) =>
                          updateSet(exerciseIndex, setIndex, "reps", parseInt(e.target.value) || 0)
                        }
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => removeSet(exerciseIndex, setIndex)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createWorkoutMutation.isPending}>
              {createWorkoutMutation.isPending ? "Creating..." : "Create Workout"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}