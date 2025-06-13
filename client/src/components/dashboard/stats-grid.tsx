import { Calendar, Weight, Clock } from "lucide-react";

interface Stats {
  weeklyWorkouts: number;
  totalWeight: number;
  avgDuration: number;
}

interface StatsGridProps {
  stats?: Stats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="stat-card p-6 rounded-xl animate-pulse">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="ml-4">
                <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-8 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "This Week",
      value: stats?.weeklyWorkouts || 0,
      unit: "workouts",
      icon: Calendar,
    },
    {
      title: "Total Weight",
      value: stats?.totalWeight?.toLocaleString() || 0,
      unit: "lbs lifted",
      icon: Weight,
    },
    {
      title: "Avg Duration",
      value: stats?.avgDuration || 0,
      unit: "minutes",
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="stat-card p-6 rounded-xl">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icon className="text-gray-800 w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{item.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500">{item.unit}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
