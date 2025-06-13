
import React from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button 
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="w-full"
              >
                Try again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Reload page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ApiErrorDisplay({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-red-600">Connection Error</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          {error.message.includes('JSON') 
            ? 'Unable to connect to the server. Please check your connection and try again.'
            : error.message
          }
        </p>
        <Button onClick={onRetry} className="w-full">
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
