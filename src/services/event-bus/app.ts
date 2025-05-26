import { EventBusClass } from './event-bus';

export type AppEvents = {
  API_ERROR_EVENT: unknown;
};

export const appEventBus = new EventBusClass<AppEvents>();
