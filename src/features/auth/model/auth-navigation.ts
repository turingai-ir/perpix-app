const AUTH_PATH = "/auth/login";
const PARSING_ORIGIN = "https://perpix.invalid";

function localDestination(value: string | null): string {
  if (
    !value?.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    Array.from(value).some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || code === 127;
    })
  )
    return "/";
  const url = new URL(value, PARSING_ORIGIN);
  if (
    url.origin !== PARSING_ORIGIN ||
    url.pathname === "/auth" ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/api/")
  )
    return "/";
  return `${url.pathname}${url.search}${url.hash}`;
}

export function getLoginPath(destination: string): string {
  const target = localDestination(destination);
  return target === "/"
    ? AUTH_PATH
    : `${AUTH_PATH}?returnTo=${encodeURIComponent(target)}`;
}

export function getPostLoginPath(search: string): string {
  return localDestination(new URLSearchParams(search).get("returnTo"));
}
