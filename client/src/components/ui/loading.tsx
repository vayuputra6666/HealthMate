
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
      <div className={cn("animate-spin", sizeClasses[size])}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 12C4 12.5523 3.55228 13 3 13C2.44772 13 2 12.5523 2 12C2 10.8954 2.89543 10 4 10C4.55228 10 5 10.4477 5 11V12Z"
            fill="currentColor"
            className="text-blue-600"
          />
          <path
            d="M20 12C20 12.5523 20.4477 13 21 13C21.5523 13 22 12.5523 22 12C22 10.8954 21.1046 10 20 10C19.4477 10 19 10.4477 19 11V12Z"
            fill="currentColor"
            className="text-blue-600"
          />
          <rect
            x="5"
            y="11.5"
            width="14"
            height="1"
            rx="0.5"
            fill="currentColor"
            className="text-gray-600"
          />
          <circle cx="3" cy="12" r="2" stroke="currentColor" strokeWidth="1" fill="none" className="text-blue-600" />
          <circle cx="21" cy="12" r="2" stroke="currentColor" strokeWidth="1" fill="none" className="text-blue-600" />
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
