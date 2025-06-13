import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Dumbbell, Target, Clock } from "lucide-react";
import { LoadingState, EmptyState } from "@/components/ui/loading";

interface Exercise {
  id: number;
  name: string;
  category: string;
  instructions: string;
  difficulty: string;
  equipment: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
}

export default function Exercises() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const { data: exercises, isLoading, error } = useQuery({
    queryKey: ["/api/exercises"],
    queryFn: () => fetch("/api/exercises").then((res) => res.json()),
  });

  const filteredExercises = useMemo(() => {
    if (!exercises) return [];

    return exercises.filter((exercise: Exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));

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
      <EmptyState
        title="No exercises found"
        description="The exercise database is empty. Please check back later."
        icon={<Dumbbell className="w-12 h-12" />}
      />
    );
  }

  return (
    <div>
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
            <Card key={exercise.id}>
              <CardHeader>
                <CardTitle>{exercise.name}</CardTitle>
                <CardDescription>{exercise.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{exercise.instructions}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}