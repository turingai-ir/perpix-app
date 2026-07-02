import { Component, type ErrorInfo, type ReactNode } from "react";

import { useAppTranslate } from "@/hook";
import { captureError } from "@/lib/observability";
import { APP_I18_KEYS } from "@/services/i18";

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
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <main className="bg-background text-foreground flex min-h-svh items-center justify-center px-4 text-center">
      <p className="text-base leading-7 font-medium sm:text-lg">
        {t("components.custom.errorBoundary.fallbackMessage")}
      </p>
    </main>
  );
}

export { ErrorBoundary, ErrorFallbackPage };
