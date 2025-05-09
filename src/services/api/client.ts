import createFetch, { type Middleware } from 'openapi-fetch'

import { appFetchApiErrorQueue } from '../queue'

import type { paths } from './api'

import { APP_KEYS, createCustomFetch } from '@/utils'
import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from '@/utils/custom-fetch/fetch-errors'

export const apiClinet = createFetch<paths>({
  fetch: createCustomFetch(globalThis.fetch, { retryOnNetworkError: false, maxRetries: 0 }),
  baseUrl: APP_KEYS.API_BASE_URL,
})

const errorMiddleware: Middleware = {
  onError: ({ error }) => {
    appFetchApiErrorQueue.enqueue(error as FetchHttpError | FetchNetworkError | FetchTimeoutError)
    throw error
  },
}
apiClinet.use(errorMiddleware)
