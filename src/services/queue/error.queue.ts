import { BaseQueue } from './queue-base'

export class ErrorQueue<T extends Error> extends BaseQueue<T> {
  public constructor() {
    super()
  }
}
