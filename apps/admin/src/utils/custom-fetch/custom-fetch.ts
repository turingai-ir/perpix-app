import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from "./fetch-errors";
import {
  combineAbortSignals,
  creatTimeOutAbortController,
  fakeDelay,
  isErrorAbortError,
  isNetworkError,
  isRetryableStatus,
} from "./helpers";

interface CustomFetchOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  maxRetryDelayMs?: number;
  timeoutMs?: number;
  retryOnNetworkError?: boolean;
  onTimeout?: () => void;
  onRetryAttempt?: (info: {
    attempt: number;
    error: unknown;
    nextDelayMs: number;
  }) => void;
  onFinalError?: (error: unknown) => void;
}

/**
 * Creates a custom fetch function with enhanced features such as retries, timeouts, and error handling.
 *
 * @param originalFetch - The original `fetch` function to be wrapped.
 * @param options - Optional configuration for the custom fetch behavior.
 *
 * @returns A custom fetch function that supports retries, timeouts, and enhanced error handling.
 *
 * ### Options
 * - `maxRetries` (number): The maximum number of retry attempts. Defaults to `0`.
 * - `retryDelayMs` (number): The initial delay between retries in milliseconds. Defaults to `1000`.
 * - `maxRetryDelayMs` (number): The maximum delay between retries in milliseconds. Defaults to `5000`.
 * - `retryOnNetworkError` (boolean): Whether to retry on network errors. Defaults to `false`.
 * - `timeoutMs` (number): The timeout duration in milliseconds. If exceeded, the request will be aborted.
 * - `onRetryAttempt` (function): A callback invoked on each retry attempt with details about the attempt.
 * - `onFinalError` (function): A callback invoked when all retries are exhausted or a non-retryable error occurs.
 * - `onTimeout` (function): A callback invoked when a timeout occurs.
 *
 * ### Behavior
 * - Retries are attempted for retryable HTTP status codes or network errors (if `retryOnNetworkError` is enabled).
 * - The delay between retries increases exponentially, capped by `maxRetryDelayMs`.
 * - If a timeout is specified and exceeded, the request is aborted, and a `FetchTimeoutError` is thrown.
 * - If all retries are exhausted or a non-retryable error occurs, the `onFinalError` callback is invoked, and the error is thrown.
 *
 * ### Errors
 * - `FetchHttpError`: Thrown when a non-retryable HTTP error occurs.
 * - `FetchTimeoutError`: Thrown when the request times out.
 * - `FetchNetworkError`: Thrown when a network error occurs and retries are exhausted.
 *
 * @example
 * ```typescript
 * const customFetch = createCustomFetch(fetch, {
 *   maxRetries: 3,
 *   retryDelayMs: 1000,
 *   timeoutMs: 5000,
 *   onRetryAttempt: ({ attempt, error, nextDelayMs }) => {
 *     console.log(`Retry attempt ${attempt} failed. Retrying in ${nextDelayMs}ms...`);
 *   },
 *   onFinalError: (error) => {
 *     console.error('Final error:', error);
 *   },
 * });
 *
 * const response = await customFetch('https://api.example.com/data');
 * ```
 */
export function createCustomFetch(
  originalFetch: typeof globalThis.fetch,
  options?: CustomFetchOptions,
) {
  return async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    const userSignal = init?.signal;
    let lastError: unknown = null;
    let retriesLeft: number = options?.maxRetries ?? 0;
    let currentDelay: number = options?.retryDelayMs ?? 1000;
    const maxRetryDelay = options?.maxRetryDelayMs ?? 5000;
    const retryOnNetworkError = options?.retryOnNetworkError ?? false;
    const timeoutMs = options?.timeoutMs;

    let timeoutTriggered = false;
    const timeoutAbortController = timeoutMs
      ? creatTimeOutAbortController(timeoutMs, () => {
          timeoutTriggered = true;
          options?.onTimeout?.();
        })
      : null;

    const onRetryAttempt = options?.onRetryAttempt;
    const onFinalError = options?.onFinalError;

    while (retriesLeft >= 0) {
      const attempt = (options?.maxRetries ?? 0) - retriesLeft + 1;
      const attemptController = new AbortController();
      const signals = [
        attemptController.signal,
        userSignal,
        timeoutAbortController?.signal,
      ].filter(Boolean) as AbortSignal[];
      const combinedSignal = combineAbortSignals(signals);

      const request = {
        input,
        init: {
          ...init,
          signal: combinedSignal,
        },
      };

      try {
        const response = await originalFetch(request.input, request.init);

        if (response.ok) {
          return response;
        }

        lastError = response;

        if (!isRetryableStatus(response.status) || retriesLeft === 0) {
          break;
        }
      } catch (error) {
        lastError = error;

        if (isErrorAbortError(error)) {
          lastError = timeoutTriggered
            ? new FetchTimeoutError(lastError, request.input)
            : error;
          break;
        }

        if (!isNetworkError(error)) {
          break;
        }

        if (!retryOnNetworkError || retriesLeft === 0) {
          lastError = new FetchNetworkError(lastError, request.input);
          break;
        }
      }

      await fakeDelay(currentDelay);
      currentDelay = Math.min(currentDelay * 2, maxRetryDelay);
      retriesLeft--;

      onRetryAttempt?.({
        attempt,
        error: lastError,
        nextDelayMs: currentDelay,
      });
    }

    if (lastError instanceof Response) {
      lastError = new FetchHttpError(lastError, input);
    }

    onFinalError?.(lastError);
    throw lastError;
  };
}
