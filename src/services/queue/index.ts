import { ErrorQueue } from './error.queue'

export const appFetchApiErrorQueue = new ErrorQueue<Error>()
