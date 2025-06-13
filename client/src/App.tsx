
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Workouts from "@/pages/workouts";
import Exercises from "@/pages/exercises";
import Progress from "@/pages/progress";
import History from "@/pages/history";
import Nutrition from "@/pages/nutrition";
import Motivation from "@/pages/motivation";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { useState } from "react";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/workouts" element={<Workouts />} />
      <Route path="/exercises" element={<Exercises />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/history" element={<History />} />
      <Route path="/nutrition" element={<Nutrition />} />
      <Route path="/motivation" element={<Motivation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
          <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="bg-white border-b border-gray-100 p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button 
                      className="md:hidden mr-4 text-gray-500 hover:text-gray-900"
                      onClick={() => setMobileNavOpen(true)}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto">
                <Router />
              </main>
            </div>
            <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
          </div>
        </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
