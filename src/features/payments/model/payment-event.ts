import { z } from "zod";

export const paymentEventSchema = z.object({
  intent_uuid: z.uuid(),
  execution_uuid: z.uuid(),
});

export type PaymentEvent = z.infer<typeof paymentEventSchema>;
