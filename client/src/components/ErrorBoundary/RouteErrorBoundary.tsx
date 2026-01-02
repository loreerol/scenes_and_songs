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

class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Route-level error boundary caught an error in ${this.props.domain}:`, {
      domain: this.props.domain,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send to observability service (Sentry, LogRocket, etc.)

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
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

    return this.props.children;
  }
}

export default RouteErrorBoundary;
