import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { X, Home, Dumbbell, Search, TrendingUp, Clock, Utensils, Target } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Workouts", href: "/workouts", icon: Dumbbell },
  { name: "Exercises", href: "/exercises", icon: Search },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "History", href: "/history", icon: Clock },
  { name: "Nutrition", href: "/nutrition", icon: Utensils },
  { name: "Motivation", href: "/motivation", icon: Target },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const [location] = useLocation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <Dumbbell className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">HealthMate</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  onClick={onClose}
                  className={cn(
                    "group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors cursor-pointer",
                    isActive
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-4 flex-shrink-0 h-6 w-6",
                      isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}