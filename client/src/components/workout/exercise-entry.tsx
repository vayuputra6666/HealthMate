import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import type { Exercise } from "@shared/schema";

interface ExerciseEntryProps {
  exercise: {
    exerciseId: number;
    sets: {
      weight?: string;
      reps?: number;
    }[];
  };
  availableExercises: Exercise[];
  onChange: (exercise: ExerciseEntryProps["exercise"]) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export default function ExerciseEntry({ 
  exercise, 
  availableExercises, 
  onChange, 
  onRemove, 
  canRemove 
}: ExerciseEntryProps) {
  
  const updateExerciseId = (exerciseId: string) => {
    onChange({
      ...exercise,
      exerciseId: parseInt(exerciseId),
    });
  };

  const updateSet = (setIndex: number, field: "weight" | "reps", value: string | number) => {
    const newSets = [...exercise.sets];
    newSets[setIndex] = {
      ...newSets[setIndex],
      [field]: value,
    };
    onChange({
      ...exercise,
      sets: newSets,
    });
  };

  const addSet = () => {
    onChange({
      ...exercise,
      sets: [...exercise.sets, { weight: "", reps: 0 }],
    });
  };

  const removeSet = (setIndex: number) => {
    if (exercise.sets.length > 1) {
      onChange({
        ...exercise,
        sets: exercise.sets.filter((_, i) => i !== setIndex),
      });
    }
  };

  return (
    <div className="exercise-card p-4">
      <div className="flex items-center justify-between mb-3">
        <Select 
          value={exercise.exerciseId > 0 ? exercise.exerciseId.toString() : ""} 
          onValueChange={updateExerciseId}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select Exercise" />
          </SelectTrigger>
          <SelectContent>
            {availableExercises.map((ex) => (
              <SelectItem key={ex.id} value={ex.id.toString()}>
                {ex.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="ml-3 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-3 text-xs font-medium text-gray-500 px-2">
          <span>Weight (lbs)</span>
          <span>Reps</span>
          <span>Set</span>
        </div>
        
        {exercise.sets.map((set, setIndex) => (
          <div key={setIndex} className="grid grid-cols-3 gap-3 items-center">
            <Input
              type="text"
              placeholder="185"
              value={set.weight || ""}
              onChange={(e) => updateSet(setIndex, "weight", e.target.value)}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="8"
              value={set.reps || ""}
              onChange={(e) => updateSet(setIndex, "reps", parseInt(e.target.value) || 0)}
              className="text-sm"
            />
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">{setIndex + 1}</span>
              {exercise.sets.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSet(setIndex)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Minus className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addSet}
        className="mt-3 text-sm text-gray-600 hover:text-gray-900 p-0"
      >
        <Plus className="w-3 h-3 mr-2" />
        Add Set
      </Button>
    </div>
  );
}
