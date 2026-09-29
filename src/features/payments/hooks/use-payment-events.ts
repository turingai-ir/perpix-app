import { useEffect, useRef } from "react";

import { connectPaymentEvents } from "../services/payment-event-stream";
import type { PaymentEvent } from "../model/payment-event";

export function usePaymentEvents({
  accessToken,
  onChange,
  onReconnect,
}: {
  accessToken: string | undefined;
  onChange: (event: PaymentEvent) => void;
  onReconnect: () => void;
}) {
  const onChangeRef = useRef(onChange);
  const onReconnectRef = useRef(onReconnect);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    onReconnectRef.current = onReconnect;
  }, [onReconnect]);

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    let connectedOnce = false;
    void connectPaymentEvents({
      accessToken,
      signal: controller.signal,
      onConnected: () => {
        if (connectedOnce) onReconnectRef.current();
        connectedOnce = true;
      },
      onChange: (event) => onChangeRef.current(event),
    }).catch(() => {
      /* Authorization expiry is handled by normal API requests. */
    });
    return () => controller.abort();
  }, [accessToken]);
}
