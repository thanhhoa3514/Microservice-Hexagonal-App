/**
 * @description Represents a generic event structure.
 */
export interface IEvent<T = any> {
  /**
   * A unique identifier for the event instance.
   */
  id: string;
  /**
   * The name or topic of the event (e.g., 'order.created').
   */
  topic: string;
  /**
   * The payload of the event.
   */
  data: T;
  /**
   * Timestamp of when the event occurred.
   */
  timestamp: Date;
}

/**
 * @description Port for publishing events.
 */
export interface IEventPublisher {
  publish(event: IEvent): Promise<void>;
}

/**
 * @description Port for subscribing to events.
 */
export interface IEventSubscriber {
  subscribe<T>(
    topic: string,
    handler: (event: IEvent<T>) => void
  ): Promise<void>;
}
