import { Link, useLocation } from "wouter";
import { BarChart3, Dumbbell, List, TrendingUp, History, X } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Workouts", href: "/workouts", icon: Dumbbell },
  { name: "Exercises", href: "/exercises", icon: List },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "History", href: "/history", icon: History },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const [location] = useLocation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">GymTracker</h1>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <nav className="mt-6">
          <div className="px-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <a 
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                    onClick={onClose}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
