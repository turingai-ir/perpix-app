import { EventBusClass } from './event-bus';

export type AppEvents = {
  API_ERROR_EVENT: unknown;
  SIDEBAR_REQUEST_FOR_DATA: unknown;
};

export const appEventBus = new EventBusClass<AppEvents>();
