export function clearPaymentSession(): void {
  for (const key of Object.keys(sessionStorage)) {
    if (key.startsWith("payment-intent:") || key.startsWith("payment-retry:")) {
      sessionStorage.removeItem(key);
    }
  }
}
