import * as manager from "../services/session-manager";
import { sessionStore } from "../services/session-store";
import { createAuthorizedFetch } from "../services/authorized-fetch";
import { queryClient } from "@/shared/lib/react-query";
import "@/shared/lib/private-data";

export { manager, sessionStore, queryClient, createAuthorizedFetch };
export const issued = (token: string, expiresInSeconds = 900) => ({
  accessToken: token,
  csrfToken: "synthetic-csrf",
  expiresInSeconds,
});
