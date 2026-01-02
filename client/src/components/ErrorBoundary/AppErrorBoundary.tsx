import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class AppErrorBoundary extends Component<Props, State> {
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
    console.error("App-level error boundary caught an error:", {
      domain: "app-root",
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

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center bg-gray-100">
          <h1 className="text-2xl mb-4 text-gray-800">
            Something went wrong
          </h1>
          <p className="text-base mb-6 text-gray-600">
            The app encountered an unexpected error. Please try restarting.
          </p>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mb-6 p-4 bg-white border border-gray-300 rounded max-w-2xl text-left">
              <summary className="cursor-pointer font-bold">
                Error Details (dev only)
              </summary>
              <pre className="mt-3 text-xs overflow-auto text-red-600">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <button
            onClick={this.handleReset}
            className="px-6 py-3 text-base bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
