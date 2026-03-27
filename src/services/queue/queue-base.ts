/**
 * A listener function type for queue events.
 * @template T - The type of items stored in the queue.
 */
type QueueListener<T> = (item: T) => void;

/**
 * Abstract base class representing a generic queue with event listeners for enqueue and dequeue operations.
 *
 * Provides basic queue operations (enqueue, dequeue, peek, etc.) and allows listeners
 * to subscribe to `'add'` and `'remove'` events when items are added or removed.
 *
 * @template T - The type of items stored in the queue.
 */
export abstract class BaseQueue<T> {
  /** Internal array holding queue items. */
  private items: T[] = [];

  /**
   * Event listeners for `'add'` and `'remove'` events.
   * Each event maintains a set of listeners.
   */
  private listeners: { add: Set<QueueListener<T>>; remove: Set<QueueListener<T>> } = {
    add: new Set(),
    remove: new Set(),
  };

  /**
   * Protected constructor to prevent direct instantiation.
   * This class is intended to be extended.
   */
  protected constructor() {}

  /**
   * Adds an item to the queue and notifies `'add'` event listeners.
   * @param item - The item to enqueue.
   */
  public enqueue(item: T): void {
    this.items.push(item);
    this.emit('add', item);
  }

  /**
   * Removes and returns the item at the front of the queue.
   * Notifies `'remove'` event listeners if an item was dequeued.
   * @returns The dequeued item, or `undefined` if the queue is empty.
   */
  public dequeue(): T | undefined {
    const item = this.items.shift();
    if (item !== undefined) {
      this.emit('remove', item);
    }
    return item;
  }

  /**
   * Returns the item at the front of the queue without removing it.
   * @returns The item at the front, or `undefined` if the queue is empty.
   */
  public peek(): T | undefined {
    return this.items[0];
  }

  /**
   * Checks whether the queue is empty.
   * @returns `true` if the queue is empty, `false` otherwise.
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Gets the current number of items in the queue.
   */
  public get size(): number {
    return this.items.length;
  }

  /**
   * Returns a shallow copy of the queue as an array.
   * @returns An array containing the queue's items in order.
   */
  public toArray(): T[] {
    return [...this.items];
  }

  /**
   * Subscribes a listener to an event (`'add'` or `'remove'`).
   * @param event - The event type to listen for.
   * @param listener - The listener function to invoke when the event occurs.
   */
  public on(event: 'add' | 'remove', listener: QueueListener<T>): void {
    this.listeners[event].add(listener);
  }

  /**
   * Unsubscribes a listener from an event (`'add'` or `'remove'`).
   * @param event - The event type to stop listening for.
   * @param listener - The listener function to remove.
   */
  public off(event: 'add' | 'remove', listener: QueueListener<T>): void {
    this.listeners[event].delete(listener);
  }

  /**
   * Emits an event to all registered listeners for that event type.
   * Catches and logs errors from listeners to prevent disruption.
   * @param event - The event type to emit.
   * @param item - The item associated with the event.
   */
  private emit(event: 'add' | 'remove', item: T) {
    for (const fn of this.listeners[event]) {
      try {
        fn(item);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
