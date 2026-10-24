import { canRetryFileRequest } from "../model/file-error";

export async function retryFileRequest<T>(
  request: () => Promise<T>,
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await request();
    } catch (error) {
      if (attempt === 2 || !navigator.onLine || !canRetryFileRequest(error))
        throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    }
  }
}
