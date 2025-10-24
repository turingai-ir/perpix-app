import { EventBusClass } from './event-bus';

export type AppEvents = {
  API_ERROR_EVENT: unknown;
  SIDEBAR_REQUEST_FOR_DATA: unknown;
  SCROLL_APP_LAYOUT_UNTIL_END: undefined;
};

export const appEventBus = new EventBusClass<AppEvents>();
