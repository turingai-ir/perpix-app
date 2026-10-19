import type { z } from "zod";

import { AuthRequestError, failureFromResponse } from "../model/auth-failure";
import {
  accessResponseSchema,
  authStartSchema,
  challengeSchema,
  csrfResponseSchema,
  type AuthChallenge,
  type IssuedSession,
} from "../model/types";

import { APP_KEYS } from "@/utils";

const AUTH_BASE_URL = `${APP_KEYS.API_BASE_URL}/api/v1/auth`;
const CSRF_HEADER = "X-CSRF-TOKEN";

interface SendOptions {
  method?: "GET" | "POST";
  body?: unknown;
  csrfToken?: string;
  bearer?: string;
}

async function send(path: string, options: SendOptions = {}) {
  const headers = new Headers();
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (options.csrfToken) headers.set(CSRF_HEADER, options.csrfToken);
  if (options.bearer) headers.set("Authorization", `Bearer ${options.bearer}`);

  let response: Response;
  try {
    response = await fetch(`${AUTH_BASE_URL}${path}`, {
      method: options.method ?? "POST",
      headers,
      credentials: "include",
      cache: "no-store",
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new AuthRequestError({ kind: "network" });
  }

  if (!response.ok) throw await failureFromResponse(response);

  return response;
}

async function parse<Schema extends z.ZodType>(
  response: Response,
  schema: Schema,
): Promise<z.infer<Schema>> {
  try {
    return schema.parse(await response.json());
  } catch {
    throw new AuthRequestError({ kind: "contract" }, response.status);
  }
}

async function readIssuedSession(response: Response): Promise<IssuedSession> {
  const access = await parse(response, accessResponseSchema);
  // A missing CSRF header means CORS/proxy misconfiguration: refresh would
  // be impossible later, so fail the sign-in now instead of silently.
  const csrfToken = response.headers.get(CSRF_HEADER);
  if (!csrfToken) {
    throw new AuthRequestError({ kind: "contract" });
  }

  return {
    accessToken: access.access_token,
    csrfToken,
    expiresInSeconds: access.expires_in,
  };
}

const challenge = async (path: string, phoneNumber: string) =>
  parse(
    await send(path, { body: { phone_number: phoneNumber } }),
    challengeSchema,
  );

export const requestPasswordResetChallenge = (
  phoneNumber: string,
): Promise<AuthChallenge> =>
  challenge("/password-reset-challenges", phoneNumber);

export const resendChallenge = async (
  challengeId: string,
): Promise<AuthChallenge> =>
  parse(
    await send(`/challenges/${encodeURIComponent(challengeId)}/resend`),
    challengeSchema,
  );

export const completeRegistration = async (body: {
  challenge_id: string;
  otp_code: string;
  password: string;
}) => readIssuedSession(await send("/registrations", { body }));

export const completePasswordReset = async (body: {
  challenge_id: string;
  otp_code: string;
  new_password: string;
}) => {
  await send("/password-resets", { body });
};

export const login = async (body: { phone_number: string; password: string }) =>
  readIssuedSession(await send("/login", { body }));

export const fetchCsrfToken = async () =>
  (await parse(await send("/csrf", { method: "GET" }), csrfResponseSchema))
    .csrf_token;

export const refreshTokens = async (csrfToken: string) =>
  readIssuedSession(await send("/refresh", { csrfToken }));

export const logout = async (csrfToken: string) => {
  await send("/logout", { csrfToken });
};

export const logoutAll = async (bearer: string) => {
  await send("/logout-all", { bearer });
};

export const changePassword = async (
  bearer: string,
  body: { current_password: string; new_password: string },
) => {
  await send("/password-changes", { bearer, body });
};

export const startAuth = async (phoneNumber: string) =>
  parse(
    await send("/start", { body: { phone_number: phoneNumber } }),
    authStartSchema,
  );
