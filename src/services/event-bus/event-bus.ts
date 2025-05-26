export class EventBusClass<Events> {
  private target = new EventTarget();

  constructor() {}

  // Emit an event with a specific payload
  emit<K extends keyof Events>(type: K, detail: Events[K]) {
    const event = new CustomEvent<Events[K]>(String(type), { detail });
    this.target.dispatchEvent(event);
  }

  // Add an event listener for a specific event type
  on<K extends keyof Events>(type: K, callback: (detail: Events[K]) => void) {
    const handler = (event: Event) => {
      callback((event as CustomEvent<Events[K]>).detail);
    };
    this.target.addEventListener(String(type), handler);
    return () => this.target.removeEventListener(String(type), handler); // return unsubscribe function
  }

  // Add an event listener that listens for only one occurrence of the event
  once<K extends keyof Events>(type: K, callback: (detail: Events[K]) => void) {
    const handler = (event: Event) => {
      callback((event as CustomEvent<Events[K]>).detail);
    };
    this.target.addEventListener(String(type), handler, { once: true });
  }

  // Remove a specific event listener
  off<K extends keyof Events>(type: K, callback: (detail: Events[K]) => void) {
    const handler = (event: Event) => {
      callback((event as CustomEvent<Events[K]>).detail);
    };
    this.target.removeEventListener(String(type), handler);
  }
}
