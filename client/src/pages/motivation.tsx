import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface MotivationalQuote {
  id: number;
  quote: string;
  author: string;
  category: "motivation" | "fitness" | "nutrition" | "mindset";
}

interface DailyChallenge {
  id: number;
  title: string;
  description: string;
  type: "workout" | "nutrition" | "mindset" | "habit";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  date: string;
}

const motivationalImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    title: "Push Your Limits",
    description: "Every workout is a step closer to your goals"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    title: "Consistency is Key",
    description: "Small daily improvements lead to stunning results"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1549476464-37392f717541?w=800&h=600&fit=crop",
    title: "Mind Over Matter",
    description: "Your only limit is your mindset"
  }
];

const successStories = [
  {
    id: 1,
    name: "Sarah M.",
    achievement: "Lost 30 lbs in 6 months",
    story: "Started with just 10-minute workouts and gradually built up. The key was consistency and not giving up when progress seemed slow.",
    before: "180 lbs",
    after: "150 lbs",
    timeframe: "6 months"
  },
  {
    id: 2,
    name: "Mike T.",
    achievement: "Gained 20 lbs of muscle",
    story: "Focused on compound movements and proper nutrition. Tracked everything and stayed patient with the process.",
    before: "140 lbs",
    after: "160 lbs",
    timeframe: "8 months"
  },
  {
    id: 3,
    name: "Emma K.",
    achievement: "Completed first marathon",
    story: "Went from couch to 26.2 miles. Started with a couch-to-5K program and gradually increased distance.",
    before: "Sedentary",
    after: "Marathon finisher",
    timeframe: "12 months"
  }
];

const fitnessExperts = [
  {
    id: 1,
    name: "Dr. Fitness Pro",
    title: "Exercise Physiologist",
    tip: "Focus on progressive overload - gradually increase weight, reps, or time to keep challenging your body.",
    specialty: "Strength Training"
  },
  {
    id: 2,
    name: "Nutrition Coach Alex",
    title: "Certified Nutritionist",
    tip: "Eat protein within 30 minutes post-workout to maximize muscle protein synthesis and recovery.",
    specialty: "Sports Nutrition"
  },
  {
    id: 3,
    name: "Mindset Mentor Lisa",
    title: "Sports Psychologist",
    tip: "Visualize your success before each workout. Mental preparation is just as important as physical preparation.",
    specialty: "Mental Performance"
  }
];

export default function Motivation() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: dailyQuote, refetch: refetchQuote } = useQuery<MotivationalQuote>({
    queryKey: ['motivational-quote', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === "all" 
        ? '/api/motivation/quote' 
        : `/api/motivation/quote?category=${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch quote');
      return response.json();
    },
  });

  const { data: todaysChallenge } = useQuery<DailyChallenge>({
    queryKey: ['daily-challenge'],
    queryFn: async () => {
      const response = await fetch('/api/motivation/challenge');
      if (!response.ok) throw new Error('Failed to fetch challenge');
      return response.json();
    },
  });

  const { data: allChallenges = [] } = useQuery<DailyChallenge[]>({
    queryKey: ['all-challenges'],
    queryFn: async () => {
      const response = await fetch('/api/motivation/challenges');
      if (!response.ok) throw new Error('Failed to fetch challenges');
      return response.json();
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workout': return '💪';
      case 'nutrition': return '🥗';
      case 'mindset': return '🧠';
      case 'habit': return '⚡';
      default: return '🎯';
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🚀 Motivation Center</h1>
          <p className="text-gray-600">Stay inspired and motivated on your fitness journey</p>
        </div>

        <Tabs defaultValue="quotes" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="images">Gallery</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
            <TabsTrigger value="experts">Expert Tips</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="quotes" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Daily Inspiration</CardTitle>
                    <CardDescription>Get motivated with powerful quotes</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <select 
                      className="px-3 py-1 border rounded-md text-sm"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="motivation">Motivation</option>
                      <option value="fitness">Fitness</option>
                      <option value="nutrition">Nutrition</option>
                      <option value="mindset">Mindset</option>
                    </select>
                    <Button onClick={() => refetchQuote()} size="sm">
                      New Quote
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {dailyQuote ? (
                  <div className="text-center py-8">
                    <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-relaxed">
                      "{dailyQuote.quote}"
                    </blockquote>
                    <cite className="text-lg text-gray-600">
                      — {dailyQuote.author || "Unknown"}
                    </cite>
                    <div className="mt-4">
                      <Badge variant="secondary" className="capitalize">
                        {dailyQuote.category}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading inspirational quote...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            {/* Today's Challenge */}
            {todaysChallenge && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎯 Today's Challenge
                    <Badge className={getDifficultyColor(todaysChallenge.difficulty)}>
                      {todaysChallenge.difficulty}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">
                      {getTypeIcon(todaysChallenge.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{todaysChallenge.title}</h3>
                      <p className="text-gray-600 mb-4">{todaysChallenge.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {todaysChallenge.type}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Reward:</span>
                          <Badge variant="secondary">
                            {todaysChallenge.points} points
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Challenge History */}
            <Card>
              <CardHeader>
                <CardTitle>Challenge Archive</CardTitle>
                <CardDescription>Past challenges to keep you motivated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allChallenges.slice(0, 10).map((challenge) => (
                    <div key={challenge.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="text-2xl">
                        {getTypeIcon(challenge.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{challenge.title}</h4>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(challenge.difficulty)} variant="secondary">
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {challenge.points} pts
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {motivationalImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative">
                    <img 
                      src={image.url} 
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center text-white p-4">
                        <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                        <p className="text-sm opacity-90">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successStories.map((story) => (
                <Card key={story.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🏆 {story.name}
                      <Badge variant="secondary">{story.timeframe}</Badge>
                    </CardTitle>
                    <CardDescription className="font-semibold text-green-600">
                      {story.achievement}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-gray-500">Before:</span>
                          <div className="font-semibold">{story.before}</div>
                        </div>
                        <div className="text-center">
                          <span className="text-gray-500">➜</span>
                        </div>
                        <div>
                          <span className="text-gray-500">After:</span>
                          <div className="font-semibold">{story.after}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        "{story.story}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fitnessExperts.map((expert) => (
                <Card key={expert.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      👨‍⚕️ {expert.name}
                    </CardTitle>
                    <CardDescription>
                      {expert.title} • {expert.specialty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <p className="text-sm font-medium text-blue-900">
                          💡 Expert Tip
                        </p>
                        <p className="text-sm text-blue-800 mt-1">
                          {expert.tip}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Support</CardTitle>
                <CardDescription>Connect with fellow fitness enthusiasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Community Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1,234</div>
                      <div className="text-sm text-gray-600">Active Members</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">5,678</div>
                      <div className="text-sm text-gray-600">Workouts Shared</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">892</div>
                      <div className="text-sm text-gray-600">Success Stories</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">156</div>
                      <div className="text-sm text-gray-600">Challenges Completed</div>
                    </div>
                  </div>

                  {/* Feature Coming Soon */}
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-4xl mb-4">🚧</div>
                    <h3 className="text-lg font-semibold mb-2">Community Features Coming Soon!</h3>
                    <p className="text-gray-600 mb-4">
                      Share your progress, motivate others, and get support from the GYM BRO community.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="outline">Progress Sharing</Badge>
                      <Badge variant="outline">Workout Buddies</Badge>
                      <Badge variant="outline">Group Challenges</Badge>
                      <Badge variant="outline">Achievement Badges</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}