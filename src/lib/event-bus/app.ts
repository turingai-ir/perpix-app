import { EventBusClass } from "./event-bus";

export type AppEvents = {
  API_ERROR_EVENT: unknown;
  SIDEBAR_REQUEST_FOR_DATA: unknown;
  SCROLL_APP_LAYOUT_UNTIL_END: { force?: boolean } | undefined;
};

export const appEventBus = new EventBusClass<AppEvents>();
