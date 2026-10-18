const LEGACY_ACCESS_TOKEN_COOKIE = "access_token";

/**
 * Before the IAM release the access token lived in a JS-readable cookie.
 * Remove it so users are moved cleanly to the in-memory session flow.
 */
export function purgeLegacyAuthStorage() {
  if (typeof document === "undefined") return;

  document.cookie = `${LEGACY_ACCESS_TOKEN_COOKIE}=; Max-Age=0; Path=/`;
}
