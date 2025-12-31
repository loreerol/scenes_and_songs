import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { logQueryError, logMutationError } from "../utils/observability";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

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

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const domain = String(query.queryKey?.[0] || "unknown");
      const gameId = window.location.pathname.split("/")[2] || null;
      const currentRoute = window.location.pathname.split("/")[3] || "home";

      logQueryError(getErrorMessage(error), {
        domain,
        context: "QueryCache-onError",
        queryKey: query.queryKey,
        status: getErrorStatus(error),
        gameId,
        route: currentRoute,
      });
    },
  }),

  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      const domain = String(mutation.options.mutationKey?.[0] || "mutation");
      const gameId = window.location.pathname.split("/")[2] || null;
      const currentRoute = window.location.pathname.split("/")[3] || "home";

      logMutationError(getErrorMessage(error), {
        domain,
        context: "MutationCache-onError",
        mutationKey: mutation.options.mutationKey,
        variables,
        status: getErrorStatus(error),
        gameId,
        route: currentRoute,
      });
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