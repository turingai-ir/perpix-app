import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendTestSms, SmsTestError } from "../services/send-test-sms";

export function useSmsTest() {
  const mutation = useMutation({
    mutationFn: sendTestSms,
    retry: false,
    networkMode: "always",
  });
  const [now, setNow] = useState(Date.now);
  const retryAt =
    mutation.error instanceof SmsTestError ? mutation.error.retryAt : 0;
  useEffect(() => {
    if (!retryAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [retryAt]);
  return {
    ...mutation,
    seconds: Math.max(0, Math.ceil((retryAt - now) / 1000)),
  };
}
