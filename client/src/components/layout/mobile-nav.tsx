import { Link, useLocation } from "wouter";
import { BarChart3, Dumbbell, List, TrendingUp, History, Apple, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Workouts", href: "/workouts", icon: Dumbbell },
  { name: "Exercises", href: "/exercises", icon: List },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Nutrition", href: "/nutrition", icon: Apple },
  { name: "History", href: "/history", icon: History },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const [location] = useLocation();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>GymTracker</SheetTitle>
        </SheetHeader>
        <nav className="mt-6">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;

              return (
                <div key={item.name} className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`} onClick={() => {
                  window.location.href = item.href;
                  onClose();
                }}>
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
              );
            })}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}