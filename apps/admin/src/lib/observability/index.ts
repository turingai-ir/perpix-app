function captureError(error: unknown, componentStack?: string) {
  if (import.meta.env.DEV) {
    console.error("ErrorBoundary caught an error:", error, componentStack);
  }
}

export { captureError };
