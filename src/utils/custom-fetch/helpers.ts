import { HttpStatus } from './http-status';

export function fakeDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRetryableStatus(status: number): boolean {
  return [
    HttpStatus.INTERNAL_SERVER_ERROR,
    HttpStatus.BAD_GATEWAY,
    HttpStatus.SERVICE_UNAVAILABLE,
    HttpStatus.GATEWAY_TIMEOUT,
  ].includes(status as never);
}

/**
 * Determines if a given error is a network-related error.
 *
 * This function checks if the provided error is an instance of `TypeError` and
 * examines its message to identify common patterns associated with network errors
 * across various platforms and environments.
 *
 * @param error - The error object to evaluate.
 * @returns `true` if the error is identified as a network error, otherwise `false`.
 *
 * The function checks for the following error message patterns:
 * - "failed to fetch" (Chrome, Edge, others)
 * - "networkerror" (Firefox)
 * - "load failed" (Safari)
 * - "network request failed" (React Native fetch)
 * - "the network connection was lost" (iOS-specific wording)
 * - "socket closed" (Some polyfills and low-level network errors)
 */
export function isNetworkError(error: unknown): boolean {
  if (!(error instanceof TypeError)) {
    return false;
  }

  if (typeof error?.message !== 'string') {
    return false;
  }

  const msg = error?.message.toLowerCase();

  return (
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('load failed') ||
    msg.includes('network request failed') ||
    msg.includes('the network connection was lost') ||
    msg.includes('socket closed')
  );
}

export function isErrorAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  );
}

export function creatTimeOutAbortController(
  timeoutMs: number,
  onTimeout?: () => void,
): AbortController {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    if (onTimeout) {
      onTimeout();
    }
    controller.abort();
  }, timeoutMs);

  controller.signal.addEventListener('abort', () => {
    clearTimeout(timeoutId);
  });

  return controller;
}

export function combineAbortSignals(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();

  const onAbort = () => {
    if (!controller.signal.aborted) {
      controller.abort();
    }
  };

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      break;
    }
    signal.addEventListener('abort', onAbort, { once: true });
  }

  controller.signal.addEventListener('abort', () => {
    for (const signal of signals) {
      signal.removeEventListener('abort', onAbort);
    }
  });

  return controller.signal;
}
