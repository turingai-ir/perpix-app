import { Component, type ErrorInfo, type ReactNode } from "react";

import { captureError } from "@/lib/observability";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled React error:", error, errorInfo);
    captureError(error, errorInfo.componentStack ?? undefined);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallbackPage />;
    }

    return this.props.children;
  }
}

function ErrorFallbackPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 text-center text-foreground">
      <p className="text-base font-medium leading-7 sm:text-lg">
        متاسفانه خطایی رخ داده است لطفا صفحه را رفرش کنید
      </p>
    </main>
  );
}

export { ErrorBoundary, ErrorFallbackPage };
