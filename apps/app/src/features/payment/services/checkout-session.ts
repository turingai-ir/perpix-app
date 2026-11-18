export function clearPaymentSession(): void {
  try {
    for (const key of Object.keys(sessionStorage)) {
      if (
        key.startsWith("payment-intent:") ||
        key.startsWith("payment-retry:")
      ) {
        sessionStorage.removeItem(key);
      }
    }
  } catch {
    // Storage may be blocked (private mode, restrictive policies); there is nothing to clear then.
  }
}
