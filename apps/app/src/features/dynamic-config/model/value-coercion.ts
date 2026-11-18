function emptyToUndefined(value: unknown) {
  return value === "" || value === null ? undefined : value;
}

export function toNumber(value: unknown) {
  const normalizedValue = emptyToUndefined(value);

  if (typeof normalizedValue !== "string") {
    return normalizedValue;
  }

  const trimmedValue = normalizedValue.trim();

  if (!trimmedValue) return undefined;

  const numericValue = Number(trimmedValue);

  return Number.isNaN(numericValue) ? value : numericValue;
}

export function toBoolean(value: unknown) {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}

export function toArray(value: unknown) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];

  if (typeof value !== "string") {
    return value;
  }

  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map(stripUndefinedDeep)
      .filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(value)) {
      const cleaned = stripUndefinedDeep(val);

      if (cleaned !== undefined) {
        result[key] = cleaned;
      }
    }

    return result as T;
  }

  return value;
}
