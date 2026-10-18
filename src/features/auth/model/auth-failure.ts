import { z } from "zod";

export type AuthFailure =
  | { kind: "invalid-credentials" }
  | { kind: "challenge-invalid" }
  | { kind: "rate-limited"; retryAfterSeconds: number | null }
  | { kind: "validation"; fields: string[] }
  | { kind: "forbidden" }
  | { kind: "upgrade-required" }
  | { kind: "conflict" }
  | { kind: "network" }
  | { kind: "server" }
  | { kind: "contract" }
  | { kind: "aborted" };

export class AuthRequestError extends Error {
  readonly failure: AuthFailure;
  readonly status: number | null;

  constructor(failure: AuthFailure, status: number | null = null) {
    super(`Auth request failed: ${failure.kind}`);
    this.name = "AuthRequestError";
    this.failure = failure;
    this.status = status;
    Object.setPrototypeOf(this, AuthRequestError.prototype);
  }
}

const errorBodySchema = z.object({
  detail: z.unknown().optional(),
  retry_after: z.number().nonnegative().optional(),
});

const validationItemSchema = z.object({
  loc: z.array(z.union([z.string(), z.number()])),
});

async function readBody(response: Response) {
  try {
    return errorBodySchema.parse(await response.clone().json());
  } catch {
    return {};
  }
}

function validationFields(detail: unknown): string[] {
  const items = z.array(validationItemSchema).safeParse(detail);
  if (!items.success) return [];

  return items.data
    .map((item) => item.loc[item.loc.length - 1])
    .filter((name): name is string => typeof name === "string");
}

function retryAfterFrom(
  response: Response,
  bodySeconds?: number,
): number | null {
  if (bodySeconds !== undefined) return bodySeconds;
  const header = Number(response.headers.get("Retry-After"));

  return Number.isFinite(header) && header > 0 ? header : null;
}

export async function failureFromResponse(
  response: Response,
): Promise<AuthRequestError> {
  const body = await readBody(response);
  const { status } = response;
  const failure = ((): AuthFailure => {
    if (status === 400) return { kind: "challenge-invalid" };
    if (status === 401) return { kind: "invalid-credentials" };
    if (status === 403) return { kind: "forbidden" };
    if (status === 409) return { kind: "conflict" };
    if (status === 422) {
      return { kind: "validation", fields: validationFields(body.detail) };
    }
    if (status === 426) return { kind: "upgrade-required" };
    if (status === 429) {
      return {
        kind: "rate-limited",
        retryAfterSeconds: retryAfterFrom(response, body.retry_after),
      };
    }

    return { kind: "server" };
  })();

  return new AuthRequestError(failure, status);
}

export function isAuthRequestError(error: unknown): error is AuthRequestError {
  return error instanceof AuthRequestError;
}

export function failureOf(error: unknown): AuthFailure {
  if (isAuthRequestError(error)) return error.failure;

  return { kind: "server" };
}
