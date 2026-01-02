interface LogContext {
  domain: string;
  context: string;
  issue?: string;
  [key: string]: unknown; 
}

interface ErrorContext extends LogContext {
  error?: string;
  stack?: string;
  componentStack?: string;
}

export const logWarning = (message: string, context: LogContext): void => {
  console.warn(`${context.domain}: ${message}`, {
    errorType: "data-validation-warning",
    timestamp: new Date().toISOString(),
    ...context,
  });

  // TODO: Send to observability service
};

export const logError = (message: string, context: ErrorContext): void => {
  console.error(`${context.domain}: ${message}`, {
    errorType: "component-error",
    timestamp: new Date().toISOString(),
    ...context,
  });

  // TODO: Send to observability service
};

export const logQueryError = (
  message: string,
  context: LogContext & { queryKey?: unknown; status?: number }
): void => {
  console.error(`React Query: ${message}`, {
    errorType: "query-error",
    timestamp: new Date().toISOString(),
    ...context,
  });
};
 
export const logMutationError = (
  message: string,
  context: LogContext & { mutationKey?: unknown; variables?: unknown; status?: number }
): void => {
  console.error(`React Query Mutation: ${message}`, {
    errorType: "mutation-error",
    timestamp: new Date().toISOString(),
    ...context,
  });
};
