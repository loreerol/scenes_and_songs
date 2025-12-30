import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  domain: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Route-level Error Boundary
 *
 * Purpose: Catches errors within a specific route and tags them with a domain name
 * for observability. This helps identify which phase/route is failing most often
 * during debugging and monitoring.
 *
 * For sequential game flows, this primarily provides better error context rather
 * than allowing users to skip to other routes.
 *
 * This is reusable - you can wrap any route with it by passing a different domain name.
 */
class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * This static method is called when an error is thrown
   * It updates state to trigger the fallback UI
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  /**
   * This method is called after an error is caught
   * Perfect place to log errors for debugging and observability
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error with domain context - this tells us WHICH route failed
    console.error(`Route-level error boundary caught an error in ${this.props.domain}:`, {
      domain: this.props.domain, // ← Key for observability: identifies the failure domain
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      // You could also add game-specific context here if needed:
      // gameId: window.location.pathname.split("/")[2],
    });

    // TODO: Send to observability service (Sentry, LogRocket, etc.)
    // Example:
    // Sentry.captureException(error, {
    //   tags: { domain: this.props.domain, errorType: "route-error" },
    //   extra: { componentStack: errorInfo.componentStack },
    // });

    this.setState({
      error,
      errorInfo,
    });
  }

  /**
   * Resets the error state and reloads the current page
   * In most cases, this is the only recovery option for sequential game flows
   */
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Reload the current page (stays in same game/route)
    window.location.reload();
  };

  render() {
    // If an error was caught, show the fallback UI instead of the route
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center bg-gray-50">
          <div className="max-w-md">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Something went wrong
            </h2>
            <p className="text-base mb-6 text-gray-600">
              {this.props.fallbackMessage ||
                "This page encountered an error. Try reloading to continue."}
            </p>

            {/* Development-only: Show error details for debugging */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 p-4 bg-white border border-gray-300 rounded text-left">
                <summary className="cursor-pointer font-bold text-sm">
                  Error Details (dev only)
                </summary>
                <div className="mt-2 text-xs text-gray-700">
                  <p className="font-semibold">Domain: {this.props.domain}</p>
                  <pre className="mt-2 overflow-auto text-red-600 whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            {/* Action button: Retry by reloading */}
            <button
              onClick={this.handleRetry}
              className="px-6 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    // If no error, render the route normally
    return this.props.children;
  }
}

export default RouteErrorBoundary;
