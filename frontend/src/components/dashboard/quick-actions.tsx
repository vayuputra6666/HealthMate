import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Bookmark, ChevronRight } from "lucide-react";

export default function QuickActions() {
  const quickActions = [
    {
      icon: Play,
      label: "Start Quick Workout",
      onClick: () => {
        // TODO: Implement quick workout functionality
        console.log("Start quick workout");
      },
    },
    {
      icon: RotateCcw,
      label: "Repeat Last Workout",
      onClick: () => {
        // TODO: Implement repeat last workout functionality
        console.log("Repeat last workout");
      },
    },
    {
      icon: Bookmark,
      label: "Browse Templates",
      onClick: () => {
        // TODO: Implement workout templates functionality
        console.log("Browse templates");
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6 space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg h-auto"
                onClick={action.onClick}
              >
                <div className="flex items-center">
                  <Icon className="text-gray-600 w-5 h-5 mr-3" />
                  <span className="text-sm font-medium text-gray-900">{action.label}</span>
                </div>
                <ChevronRight className="text-gray-400 w-4 h-4" />
              </Button>
            );
          })}
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">This Week's Progress</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Workout Goal</span>
                <span className="text-sm text-gray-900">4/5</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gray-800 h-2 rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Volume Goal</span>
                <span className="text-sm text-gray-900">12.4k/15k lbs</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gray-800 h-2 rounded-full" style={{ width: "83%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Time Goal</span>
                <span className="text-sm text-gray-900">185/300 min</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gray-800 h-2 rounded-full" style={{ width: "62%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
