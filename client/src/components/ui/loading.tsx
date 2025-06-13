
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("animate-bounce", sizeClasses[size])}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dumbbell handle */}
          <rect
            x="9"
            y="11"
            width="6"
            height="2"
            rx="1"
            fill="black"
          />
          {/* Left weight */}
          <rect
            x="3"
            y="8"
            width="8"
            height="8"
            rx="1"
            fill="black"
          />
          {/* Right weight */}
          <rect
            x="13"
            y="8"
            width="8"
            height="8"
            rx="1"
            fill="black"
          />
        </svg>
      </div>
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 space-y-4", className)}>
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground text-sm">{message}</p>
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
