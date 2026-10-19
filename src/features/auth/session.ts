/**
 * Non-UI public surface of the auth feature. Infrastructure such as the API
 * client and router imports from here so it never pulls React components in.
 */
export { createAuthorizedFetch } from "./services/authorized-fetch";
export { runAuthorizedStream } from "./services/authorized-stream";
export {
  bootstrapSession,
  onSessionEnded,
  retryBootstrap,
} from "./services/session-manager";
export { sessionStore } from "./services/session-store";
export type { AuthStatus } from "./model/types";

export { getLoginPath, getPostLoginPath } from "./model/auth-navigation";
