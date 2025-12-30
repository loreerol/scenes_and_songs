import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";

/**
 * Helper to safely extract error message from unknown error type
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * Helper to safely extract HTTP status from error
 */
function getErrorStatus(error: unknown): number | undefined {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "status" in error.response
  ) {
    return error.response.status as number;
  }
  return undefined;
}

/**
 * Configure React Query with global error handling and retry logic
 *
 * React Query v5 uses QueryCache and MutationCache for global error handling
 * instead of defaultOptions.queries.onError
 */
export const queryClient = new QueryClient({
  // QueryCache: handles all query errors globally
  queryCache: new QueryCache({
    onError: (error, query) => {
      const domain = query.queryKey?.[0] || "unknown";
      const gameId = window.location.pathname.split("/")[2] || null;
      const currentRoute = window.location.pathname.split("/")[3] || "home";

      console.error("React Query error:", {
        errorType: "query-error",
        domain,
        queryKey: query.queryKey,
        error: getErrorMessage(error),
        status: getErrorStatus(error),
        gameId,
        route: currentRoute,
        timestamp: new Date().toISOString(),
      });

      // TODO: Send to observability service (Sentry, LogRocket, etc.)
      // Example:
      // Sentry.captureException(error, {
      //   tags: {
      //     domain,
      //     errorType: "query-error",
      //     route: currentRoute
      //   },
      //   extra: {
      //     queryKey: query.queryKey,
      //     gameId
      //   },
      // });
    },
  }),

  // MutationCache: handles all mutation errors globally
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      const domain = mutation.options.mutationKey?.[0] || "mutation";

      const gameId = window.location.pathname.split("/")[2] || null;
      const currentRoute = window.location.pathname.split("/")[3] || "home";

      console.error("React Query mutation error:", {
        errorType: "mutation-error",
        domain, 
        mutationKey: mutation.options.mutationKey,
        error: getErrorMessage(error),
        status: getErrorStatus(error),
        variables,
        gameId,
        route: currentRoute,
        timestamp: new Date().toISOString(),
      });

      // TODO: Send to observability service
      // Sentry.captureException(error, {
      //   tags: { domain, errorType: "mutation-error" },
      //   extra: { mutationKey: mutation.options.mutationKey, variables, gameId },
      // });
    },
  }),

  // Default options for all queries and mutations
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});