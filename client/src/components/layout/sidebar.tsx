import { Link, useLocation } from "wouter";
import { BarChart3, Dumbbell, List, TrendingUp, History, Apple } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Workouts", href: "/workouts", icon: Dumbbell },
  { name: "Exercises", href: "/exercises", icon: List },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Nutrition", href: "/nutrition", icon: Apple },
  { name: "History", href: "/history", icon: History },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-100 hidden md:block">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-gray-900">GymTracker</h1>
      </div>
      <nav className="mt-6">
        <div className="px-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors cursor-pointer ${
                location === item.href 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </div>
            </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}