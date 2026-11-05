import { z } from "zod";

const CHANNEL_NAME = "perpix-auth";

const messageSchema = z.object({
  type: z.enum(["session-ended", "session-started"]),
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

export function announceSessionStarted() {
  getChannel()?.postMessage({ type: "session-started", senderId });
}

export function listenForSessionChanges(handlers: {
  ended?: () => void;
  started?: () => void;
}) {
  const target = getChannel();
  if (!target) return () => undefined;

  const handler = (event: MessageEvent<unknown>) => {
    const message = messageSchema.safeParse(event.data);
    if (!message.success || message.data.senderId === senderId) return;
    if (message.data.type === "session-ended") handlers.ended?.();
    else handlers.started?.();
  };
  target.addEventListener("message", handler);

  return () => target.removeEventListener("message", handler);
}
