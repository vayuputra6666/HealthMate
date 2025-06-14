
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Quote, Trophy, Target, Zap, Star, RefreshCw, CheckCircle } from "lucide-react";
import { LoadingState, EmptyState } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";

interface MotivationalQuote {
  id: number;
  quote: string;
  author: string;
  category: string;
}

interface DailyChallenge {
  id: number;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  points: number;
  date: string;
}

export default function Motivation() {
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quote, isLoading: quoteLoading, refetch: refetchQuote } = useQuery({
    queryKey: ["/api/motivation/quote"],
    queryFn: () => fetch("/api/motivation/quote").then((res) => res.json()),
  });

  const { data: todaysChallenge, isLoading: challengeLoading } = useQuery({
    queryKey: ["/api/motivation/challenge"],
    queryFn: () => fetch("/api/motivation/challenge").then((res) => res.json()),
  });

  const { data: allChallenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["/api/motivation/challenges"],
    queryFn: () => fetch("/api/motivation/challenges").then((res) => res.json()),
  });

  const { data: workouts } = useQuery({
    queryKey: ["/api/workouts"],
    queryFn: () => fetch("/api/workouts").then((res) => res.json()),
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => fetch("/api/stats").then((res) => res.json()),
  });

  const completeChallenge = (challengeId: number) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges([...completedChallenges, challengeId]);
      toast({ 
        title: "Challenge Completed!", 
        description: "Great job! You've earned points for completing this challenge." 
      });
    }
  };

  const getNewQuote = () => {
    refetchQuote();
    toast({ title: "New quote loaded!" });
  };

  // Calculate achievements
  const calculateAchievements = () => {
    if (!workouts) return [];

    const achievements = [];
    const workoutCount = workouts.length;
    const thisWeekWorkouts = workouts.filter((w: any) => {
      const workoutDate = new Date(w.date);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return workoutDate >= weekAgo;
    }).length;

    // Workout milestones
    if (workoutCount >= 1) achievements.push({ title: "First Workout", description: "Completed your first workout", icon: "🎯", earned: true });
    if (workoutCount >= 5) achievements.push({ title: "Getting Started", description: "Completed 5 workouts", icon: "💪", earned: true });
    if (workoutCount >= 10) achievements.push({ title: "Double Digits", description: "Completed 10 workouts", icon: "🔥", earned: true });
    if (workoutCount >= 25) achievements.push({ title: "Quarter Century", description: "Completed 25 workouts", icon: "🏆", earned: true });
    if (workoutCount >= 50) achievements.push({ title: "Half Century", description: "Completed 50 workouts", icon: "🌟", earned: true });

    // Weekly streaks
    if (thisWeekWorkouts >= 3) achievements.push({ title: "Weekly Warrior", description: "3+ workouts this week", icon: "⚡", earned: true });
    if (thisWeekWorkouts >= 5) achievements.push({ title: "Gym Crusher", description: "5+ workouts this week", icon: "🚀", earned: true });

    // Add some upcoming achievements
    if (workoutCount < 5) achievements.push({ title: "Getting Started", description: "Complete 5 workouts", icon: "💪", earned: false });
    if (workoutCount < 10) achievements.push({ title: "Double Digits", description: "Complete 10 workouts", icon: "🔥", earned: false });
    if (workoutCount < 25) achievements.push({ title: "Quarter Century", description: "Complete 25 workouts", icon: "🏆", earned: false });

    return achievements;
  };

  const achievements = calculateAchievements();
  const totalPoints = completedChallenges.length * 10; // 10 points per challenge

  if (quoteLoading || challengeLoading) {
    return <LoadingState message="Loading motivation..." />;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Motivation</h1>
        <p className="text-muted-foreground mt-2">Stay motivated and track your fitness journey</p>
      </div>

      {/* Points and Level */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints}</div>
            <p className="text-xs text-muted-foreground">From completed challenges</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Trophy className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(totalPoints / 100) + 1}</div>
            <p className="text-xs text-muted-foreground">
              {totalPoints % 100}/100 to next level
            </p>
            <Progress value={(totalPoints % 100)} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {achievements.filter(a => a.earned).length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {achievements.length} unlocked
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          {/* Daily Quote */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Quote className="w-5 h-5" />
                  Daily Motivation
                </CardTitle>
                <Button variant="outline" size="sm" onClick={getNewQuote}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Quote
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {quote ? (
                <div className="space-y-4">
                  <blockquote className="text-lg italic border-l-4 border-blue-500 pl-4">
                    "{quote.quote}"
                  </blockquote>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">— {quote.author}</p>
                    <Badge variant="outline" className="capitalize">
                      {quote.category}
                    </Badge>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No quote available"
                  description="Try refreshing to get a motivational quote."
                  icon={<Quote className="w-8 h-8" />}
                  action={
                    <Button onClick={getNewQuote}>
                      Get Quote
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>

          {/* Today's Challenge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Today's Challenge
              </CardTitle>
              <CardDescription>Complete this challenge to earn points</CardDescription>
            </CardHeader>
            <CardContent>
              {todaysChallenge ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{todaysChallenge.title}</h3>
                    <p className="text-muted-foreground mt-1">{todaysChallenge.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="capitalize">
                      {todaysChallenge.type}
                    </Badge>
                    <Badge variant={todaysChallenge.difficulty === 'hard' ? 'destructive' : todaysChallenge.difficulty === 'medium' ? 'default' : 'secondary'}>
                      {todaysChallenge.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {todaysChallenge.points} points
                    </span>
                  </div>

                  <Button 
                    onClick={() => completeChallenge(todaysChallenge.id)}
                    disabled={completedChallenges.includes(todaysChallenge.id)}
                    className="w-full"
                  >
                    {completedChallenges.includes(todaysChallenge.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed!
                      </>
                    ) : (
                      "Mark as Complete"
                    )}
                  </Button>
                </div>
              ) : (
                <EmptyState
                  title="No challenge for today"
                  description="Check back tomorrow for a new challenge."
                  icon={<Zap className="w-8 h-8" />}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Challenges</CardTitle>
              <CardDescription>Complete challenges to earn points and level up</CardDescription>
            </CardHeader>
            <CardContent>
              {allChallenges && allChallenges.length > 0 ? (
                <div className="space-y-4">
                  {allChallenges.map((challenge: DailyChallenge) => (
                    <div key={challenge.id} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="capitalize text-xs">
                              {challenge.type}
                            </Badge>
                            <Badge variant={challenge.difficulty === 'hard' ? 'destructive' : challenge.difficulty === 'medium' ? 'default' : 'secondary'} className="text-xs">
                              {challenge.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {challenge.points} points
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm"
                          onClick={() => completeChallenge(challenge.id)}
                          disabled={completedChallenges.includes(challenge.id)}
                          variant={completedChallenges.includes(challenge.id) ? "secondary" : "default"}
                        >
                          {completedChallenges.includes(challenge.id) ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Done
                            </>
                          ) : (
                            "Complete"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No challenges available"
                  description="Check back later for new challenges."
                  icon={<Zap className="w-8 h-8" />}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Unlock achievements by reaching fitness milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`border rounded p-4 ${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.earned && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Motivational Quotes</CardTitle>
              <CardDescription>Get inspired with fitness and motivation quotes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Current Quote */}
                {quote && (
                  <div className="border rounded p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                    <blockquote className="text-lg italic text-center">
                      "{quote.quote}"
                    </blockquote>
                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">— {quote.author}</p>
                      <Badge variant="outline" className="mt-2 capitalize">
                        {quote.category}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Quote Categories */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['motivation', 'fitness', 'nutrition', 'mindset'].map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      className="h-20 flex flex-col"
                      onClick={() => {
                        fetch(`/api/motivation/quote?category=${category}`)
                          .then(res => res.json())
                          .then(() => refetchQuote());
                      }}
                    >
                      <div className="capitalize font-medium">{category}</div>
                      <div className="text-xs text-muted-foreground">Quotes</div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
