type Request = RequestInfo;
type Response = globalThis.Response;
export class FetchTimeoutError extends Error {
  public originalError: unknown;
  public request: Request;
  constructor(originalError: unknown, request: Request, message = 'Timeout error occurred') {
    super(message);
    this.originalError = originalError;
    this.request = request;
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, FetchTimeoutError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchTimeoutError);
    }
  }
}

export class FetchNetworkError extends Error {
  public originalError: unknown;
  public request: Request;

  constructor(originalError: unknown, request: Request, message = 'Network error occurred') {
    super(message);
    this.request = request;
    this.originalError = originalError;
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, FetchNetworkError.prototype);

    // Preserve the stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchNetworkError);
    }
  }
}

export class FetchHttpError extends Error {
  public response: Response;
  public request: Request;

  constructor(response: Response, request: Request) {
    super(`HTTP error: ${response.status}`);
    this.response = response;
    this.request = request;
    this.name = 'HttpError';
    Object.setPrototypeOf(this, FetchHttpError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchHttpError);
    }
  }

  /**
   * Attempts to parse the HTTP response body as JSON.
   *
   * @returns A promise that resolves to the parsed JSON object, or `undefined`
   *          if the response body cannot be parsed as JSON.
   */
  public async parseJson(): Promise<unknown | undefined> {
    try {
      return await this.response.clone().json();
    } catch {
      return undefined;
    }
  }
}
