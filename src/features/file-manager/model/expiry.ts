import type { UserFileItem } from "./types";

export function canUseFileForGeneration(file: UserFileItem, now = Date.now()) {
  if (!file.expire_at) return true;
  const expiry = Date.parse(file.expire_at);
  return Number.isFinite(expiry) && expiry > now + 60 * 60_000;
}
