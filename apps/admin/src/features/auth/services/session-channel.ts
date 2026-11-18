import { z } from "zod";

const CHANNEL_NAME = "perpix-auth";

const messageSchema = z.object({
  type: z.literal("session-ended"),
  senderId: z.string(),
});

const senderId = crypto.randomUUID();
let channel: BroadcastChannel | null | undefined;

function getChannel(): BroadcastChannel | null {
  if (channel === undefined) {
    channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel(CHANNEL_NAME);
  }

  return channel;
}

/** Announces a sign-out to other tabs. Never carries credentials. */
export function announceSessionEnded() {
  getChannel()?.postMessage({ type: "session-ended", senderId });
}

export function listenForSessionEnded(onEnded: () => void) {
  const target = getChannel();
  if (!target) return () => undefined;

  const handler = (event: MessageEvent<unknown>) => {
    const message = messageSchema.safeParse(event.data);
    if (message.success && message.data.senderId !== senderId) onEnded();
  };
  target.addEventListener("message", handler);

  return () => target.removeEventListener("message", handler);
}
