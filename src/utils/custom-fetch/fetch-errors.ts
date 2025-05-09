export class FetchTimeoutError extends Error {
  public originalError: unknown

  constructor(originalError: unknown, message = 'Timeout error occurred') {
    super(message)
    this.originalError = originalError
    this.name = 'TimeoutError'
    Object.setPrototypeOf(this, FetchTimeoutError.prototype)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchTimeoutError)
    }
  }
}

export class FetchNetworkError extends Error {
  public originalError: unknown

  constructor(originalError: unknown, message = 'Network error occurred') {
    super(message)
    this.originalError = originalError
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, FetchNetworkError.prototype)

    // Preserve the stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchNetworkError)
    }
  }
}

/**
 * Represents an HTTP error that occurs during a fetch request.
 * Extends the built-in `Error` class to provide additional context
 * about the HTTP response that caused the error.
 */
export class FetchHttpError extends Error {
  /**
   * Creates an instance of `FetchHttpError`.
   *
   * @param response - The `Response` object associated with the HTTP error.
   */
  public response: Response

  constructor(response: Response) {
    super(`HTTP error: ${response.status}`)
    this.response = response
    this.name = 'HttpError'
    Object.setPrototypeOf(this, FetchHttpError.prototype)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchHttpError)
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
      return await this.response.clone().json()
    } catch {
      return undefined
    }
  }
}
