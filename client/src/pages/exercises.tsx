import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Dumbbell, Target, Clock, Plus } from "lucide-react";
import { LoadingState, EmptyState } from "@/components/ui/loading";
import NewExerciseModal from "@/components/exercise/new-exercise-modal";

interface Exercise {
  id: number;
  name: string;
  category: string;
  instructions: string | null;
  difficulty: string;
  equipment: string[];
  muscleGroups: string[] | null;
}

export default function Exercises() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showNewExercise, setShowNewExercise] = useState(false);

  const { data: exercises, isLoading, error } = useQuery({
    queryKey: ["/api/exercises"],
    queryFn: () => fetch("/api/exercises").then((res) => res.json()),
  });

  const filteredExercises = useMemo(() => {
    if (!exercises) return [];

    return exercises.filter((exercise: Exercise) => {
      if (!exercise?.name || !exercise?.category) return false;

      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroups?.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        exercise.equipment?.some(equip => equip.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [exercises, searchTerm, selectedCategory, selectedDifficulty]);

  const categories = useMemo(() => {
    if (!exercises) return [];
    return [...new Set(exercises.map((exercise: Exercise) => exercise.category))];
  }, [exercises]);

  const difficulties = useMemo(() => {
    if (!exercises) return [];
    return [...new Set(exercises.map((exercise: Exercise) => exercise.difficulty))];
  }, [exercises]);

  if (isLoading) {
    return <LoadingState message="Loading exercises..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load exercises"
        description="There was an error loading the exercise database. Please try again."
        icon={<Dumbbell className="w-12 h-12" />}
        action={<Button onClick={() => window.location.reload()}>Retry</Button>}
      />
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Exercises</h1>
            <p className="text-muted-foreground mt-2">Browse and discover new exercises for your workouts</p>
          </div>
          <Button onClick={() => setShowNewExercise(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Exercise
          </Button>
        </div>

        <EmptyState
          title="No exercises found"
          description="The exercise database is empty. Please check back later."
          icon={<Dumbbell className="w-12 h-12" />}
          action={
            <Button onClick={() => setShowNewExercise(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Exercise
            </Button>
          }
        />

        <NewExerciseModal
          open={showNewExercise}
          onOpenChange={setShowNewExercise}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Exercises</h1>
          <p className="text-muted-foreground mt-2">Browse and discover new exercises for your workouts</p>
        </div>
        <Button onClick={() => setShowNewExercise(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search exercises..."
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
                      <SelectItem key={category} value={category} className="capitalize">
                        {category}
                      </SelectItem>
                    ))}
            </SelectContent>
          </Select>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              {difficulties.map((difficulty) => (
                <SelectItem key={`difficulty-${difficulty}`} value={difficulty}>
                  {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Unknown'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredExercises.length === 0 ? (
        <EmptyState
          title="No exercises found"
          description="Try adjusting your search terms or filters to find exercises."
          icon={<Search className="w-12 h-12" />}
          action={
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedDifficulty("all");
              }}
            >
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    <CardDescription className="capitalize">{exercise.category}</CardDescription>
                  </div>
                  <Badge variant={exercise.difficulty === 'advanced' ? 'destructive' : exercise.difficulty === 'intermediate' ? 'default' : 'secondary'}>
                    {exercise.difficulty || 'beginner'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{exercise.instructions || 'No instructions available'}</p>

                {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Target Muscles</h4>
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscleGroups.map((muscle, index) => (
                        <Badge key={`muscle-${exercise.id}-${index}`} variant="outline" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {exercise.equipment && exercise.equipment.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Equipment</h4>
                    <div className="flex flex-wrap gap-1">
                      {exercise.equipment.map((equip, index) => (
                        <Badge key={`equipment-${exercise.id}-${index}`} variant="secondary" className="text-xs">
                          {equip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NewExerciseModal
        open={showNewExercise}
        onOpenChange={(open) => setShowNewExercise(open)}
      />
    </div>
  );
}