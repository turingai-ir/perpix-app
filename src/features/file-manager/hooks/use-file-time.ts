import { useSyncExternalStore } from "react";

let now = Date.now();
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  now = Date.now();
  listeners.add(listener);
  timer ??= setInterval(() => {
    now = Date.now();
    listeners.forEach((notify) => notify());
  }, 15_000);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}
const inactive = () => () => {};
export function useFileTime(enabled: boolean) {
  return useSyncExternalStore(enabled ? subscribe : inactive, () => now);
}
