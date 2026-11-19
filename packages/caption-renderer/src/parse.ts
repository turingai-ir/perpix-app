export type Raw = Record<string, unknown>;

export const isRecord = (value: unknown): value is Raw =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const section = (value: unknown): Raw => (isRecord(value) ? value : {});

export const num = (
  value: unknown,
  fallback: number,
  min: number,
  max: number,
) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;

export const bool = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

export const pick = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T =>
  typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
export const color = (value: unknown, fallback: string) =>
  typeof value === "string" && HEX_COLOR.test(value) ? value : fallback;

/** A colour, or undefined when the value is missing or not a colour. */
export const optColor = (value: unknown) =>
  typeof value === "string" && HEX_COLOR.test(value) ? value : undefined;

export const optNum = (value: unknown, min: number, max: number) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : undefined;

export const family = (value: unknown, fallback: string) =>
  typeof value === "string" && /^[\p{L}\p{N} _-]{1,64}$/u.test(value)
    ? value
    : fallback;

export const optFamily = (value: unknown) =>
  typeof value === "string" && /^[\p{L}\p{N} _-]{1,64}$/u.test(value)
    ? value
    : undefined;

export const weight = (value: unknown, fallback: number) =>
  Math.round(num(value, fallback, 100, 900) / 100) * 100;

/** Role names are short lowercase words, so they stay safe as object keys. */
export const ROLE_NAME = /^[a-z][a-z0-9_]{0,15}$/;
