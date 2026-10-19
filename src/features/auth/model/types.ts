import { z } from "zod";

export type AuthStatus =
  | "initializing"
  | "authenticated"
  | "anonymous"
  | "unavailable";

export const challengeSchema = z.object({
  challenge_id: z.uuid(),
  expires_at: z.iso.datetime(),
  resend_available_at: z.iso.datetime(),
});

export type AuthChallenge = z.infer<typeof challengeSchema>;

export const accessResponseSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string(),
  expires_in: z.number().int().positive(),
});

export const csrfResponseSchema = z.object({ csrf_token: z.string().min(1) });

export interface IssuedSession {
  accessToken: string;
  expiresInSeconds: number;
}

export type ChallengePurpose = "registration" | "password-reset";

export const authStartSchema = z.discriminatedUnion("next_step", [
  z.object({ next_step: z.literal("password") }),
  challengeSchema.extend({ next_step: z.literal("registration") }),
]);
export type AuthStart = z.infer<typeof authStartSchema>;
