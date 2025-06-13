import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16", 
    lg: "w-24 h-24"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("animate-spin-reverse", sizeClasses[size])}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
          {/* Dumbbell handle with 3D effect */}
          <rect
            x="9"
            y="11"
            width="6"
            height="2"
            rx="1"
            fill="currentColor"
            className="opacity-90"
          />
          <rect
            x="9"
            y="11.5"
            width="6"
            height="1"
            rx="0.5"
            fill="white"
            className="opacity-30"
          />
          
          {/* Left weight with 3D layering */}
          <rect
            x="3"
            y="8"
            width="8"
            height="8"
            rx="2"
            fill="currentColor"
            className="opacity-95"
          />
          <rect
            x="3.5"
            y="8.5"
            width="7"
            height="3"
            rx="1.5"
            fill="white"
            className="opacity-25"
          />
          <circle
            cx="7"
            cy="12"
            r="1.5"
            fill="currentColor"
            className="opacity-80"
          />
          
          {/* Right weight with 3D layering */}
          <rect
            x="13"
            y="8"
            width="8"
            height="8"
            rx="2"
            fill="currentColor"
            className="opacity-95"
          />
          <rect
            x="13.5"
            y="8.5"
            width="7"
            height="3"
            rx="1.5"
            fill="white"
            className="opacity-25"
          />
          <circle
            cx="17"
            cy="12"
            r="1.5"
            fill="currentColor"
            className="opacity-80"
          />
        </svg>
      </div>
    </div>
  );
}

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50", className)}>
      <LoadingSpinner size="lg" />
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 space-y-4 text-center", className)}>
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && <p className="text-muted-foreground text-sm max-w-md">{description}</p>}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}