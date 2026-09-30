const checkoutStorageKey = (operationKey: string) =>
  `payment-intent:${operationKey}`;

export function getCheckoutIntentUuid(operationKey: string): string {
  const key = checkoutStorageKey(operationKey);
  const stored = sessionStorage.getItem(key);
  if (stored) return stored;

  const intentUuid = crypto.randomUUID();
  sessionStorage.setItem(key, intentUuid);
  return intentUuid;
}

export function clearCheckoutIntentUuid(operationKey: string): void {
  sessionStorage.removeItem(checkoutStorageKey(operationKey));
}

export function clearPaymentSession(): void {
  for (const key of Object.keys(sessionStorage)) {
    if (key.startsWith("payment-intent:") || key.startsWith("payment-retry:")) {
      sessionStorage.removeItem(key);
    }
  }
}

const retryKey = (intentUuid: string) => `payment-retry:${intentUuid}`;

export function getRetryExecutionUuid(intentUuid: string): string {
  const stored = sessionStorage.getItem(retryKey(intentUuid));
  if (stored) return stored;

  const executionUuid = crypto.randomUUID();
  sessionStorage.setItem(retryKey(intentUuid), executionUuid);
  return executionUuid;
}

export function clearRetryExecutionUuid(intentUuid: string): void {
  sessionStorage.removeItem(retryKey(intentUuid));
}
