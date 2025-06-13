
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ExerciseFormData {
  name: string;
  category: string;
  instructions: string;
  difficulty: string;
  muscleGroups: string[];
  equipment: string[];
}

const categories = [
  "chest", "back", "shoulders", "arms", "legs", "core", "cardio", "full-body"
];

const difficulties = ["beginner", "intermediate", "advanced"];

const commonMuscles = [
  "chest", "back", "shoulders", "biceps", "triceps", "forearms",
  "quadriceps", "hamstrings", "glutes", "calves", "abs", "obliques"
];

const commonEquipment = [
  "barbell", "dumbbell", "cable", "machine", "bodyweight", "resistance-band",
  "kettlebell", "medicine-ball", "pull-up-bar", "bench"
];

export default function NewExerciseModal({ open, onOpenChange }: NewExerciseModalProps) {
  const [muscleInput, setMuscleInput] = useState("");
  const [equipmentInput, setEquipmentInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ExerciseFormData>({
    defaultValues: {
      name: "",
      category: "",
      instructions: "",
      difficulty: "beginner",
      muscleGroups: [],
      equipment: [],
    },
  });

  const createExerciseMutation = useMutation({
    mutationFn: async (data: ExerciseFormData) => {
      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create exercise");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exercises"] });
      toast({ title: "Exercise created successfully!" });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to create exercise. Please try again.",
        variant: "destructive"
      });
    },
  });

  const onSubmit = (data: ExerciseFormData) => {
    createExerciseMutation.mutate(data);
  };

  const addMuscle = (muscle: string) => {
    const currentMuscles = form.getValues("muscleGroups");
    if (muscle && !currentMuscles.includes(muscle)) {
      form.setValue("muscleGroups", [...currentMuscles, muscle]);
    }
    setMuscleInput("");
  };

  const removeMuscle = (muscle: string) => {
    const currentMuscles = form.getValues("muscleGroups");
    form.setValue("muscleGroups", currentMuscles.filter(m => m !== muscle));
  };

  const addEquipment = (equipment: string) => {
    const currentEquipment = form.getValues("equipment");
    if (equipment && !currentEquipment.includes(equipment)) {
      form.setValue("equipment", [...currentEquipment, equipment]);
    }
    setEquipmentInput("");
  };

  const removeEquipment = (equipment: string) => {
    const currentEquipment = form.getValues("equipment");
    form.setValue("equipment", currentEquipment.filter(e => e !== equipment));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Exercise</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              {...form.register("name", { required: "Exercise name is required" })}
              placeholder="e.g., Barbell Bench Press"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={form.watch("category")} onValueChange={(value) => form.setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={form.watch("difficulty")} onValueChange={(value) => form.setValue("difficulty", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              {...form.register("instructions")}
              placeholder="Describe how to perform this exercise..."
              rows={4}
            />
          </div>

          <div>
            <Label>Target Muscles</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={muscleInput}
                  onChange={(e) => setMuscleInput(e.target.value)}
                  placeholder="Add muscle group"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMuscle(muscleInput))}
                />
                <Button type="button" onClick={() => addMuscle(muscleInput)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {commonMuscles.map((muscle) => (
                  <Button
                    key={muscle}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addMuscle(muscle)}
                    className="text-xs"
                  >
                    {muscle}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch("muscleGroups").map((muscle) => (
                  <Badge key={muscle} variant="default" className="flex items-center gap-1">
                    {muscle}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeMuscle(muscle)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Equipment</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  placeholder="Add equipment"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment(equipmentInput))}
                />
                <Button type="button" onClick={() => addEquipment(equipmentInput)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {commonEquipment.map((equipment) => (
                  <Button
                    key={equipment}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addEquipment(equipment)}
                    className="text-xs"
                  >
                    {equipment}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch("equipment").map((equipment) => (
                  <Badge key={equipment} variant="secondary" className="flex items-center gap-1">
                    {equipment}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeEquipment(equipment)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createExerciseMutation.isPending}>
              {createExerciseMutation.isPending ? "Creating..." : "Create Exercise"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
