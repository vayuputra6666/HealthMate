
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Activity, Target, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewWorkoutModal from "@/components/workout/new-workout-modal";

export default function Dashboard() {
  const [showNewWorkoutModal, setShowNewWorkoutModal] = useState(false);
  const [location, navigate] = useLocation();

  const quickActions = [
    {
      title: "Start Workout",
      description: "Begin a new workout session",
      icon: Activity,
      action: () => setShowNewWorkoutModal(true),
      color: "bg-blue-500",
    },
    {
      title: "View Progress",
      description: "Check your fitness progress",
      icon: TrendingUp,
      action: () => navigate("/progress"),
      color: "bg-green-500",
    },
    {
      title: "Browse Exercises",
      description: "Explore exercise database",
      icon: Target,
      action: () => navigate("/exercises"),
      color: "bg-purple-500",
    },
    {
      title: "Workout History",
      description: "Review past workouts",
      icon: Calendar,
      action: () => navigate("/history"),
      color: "bg-orange-500",
    },
  ];

  const stats = [
    {
      title: "This Week",
      value: "0",
      unit: "workouts",
      icon: Activity,
    },
    {
      title: "Total Sessions",
      value: "0",
      unit: "completed",
      icon: Target,
    },
    {
      title: "Current Streak",
      value: "0",
      unit: "days",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Ready to crush your fitness goals?</p>
        </div>
        <Button 
          onClick={() => setShowNewWorkoutModal(true)}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Workout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.unit}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={action.action}
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left group"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {action.description}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Section */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Create your first workout</h4>
                <p className="text-sm text-gray-600">Start by creating a workout routine that fits your goals.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-green-600">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Explore exercises</h4>
                <p className="text-sm text-gray-600">Browse our exercise database to find new movements.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-purple-600">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Track your progress</h4>
                <p className="text-sm text-gray-600">Monitor your improvements over time.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/workouts")}>
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Workouts</h3>
            <p className="text-sm text-gray-600">Manage your workout routines</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/nutrition")}>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Nutrition</h3>
            <p className="text-sm text-gray-600">Track your daily nutrition</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/motivation")}>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Motivation</h3>
            <p className="text-sm text-gray-600">Stay motivated and inspired</p>
          </CardContent>
        </Card>
      </div>

      <NewWorkoutModal 
        open={showNewWorkoutModal} 
        onOpenChange={setShowNewWorkoutModal} 
      />
    </div>
  );
}
