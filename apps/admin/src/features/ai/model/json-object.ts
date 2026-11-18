export type JsonRecord = Record<string, unknown>;

export type JsonObjectParse =
  | { readonly ok: true; readonly value: JsonRecord }
  | { readonly ok: false; readonly error: string };

/** Pretty text for a stored JSON object, as the editor shows it. */
export const stringifyJsonObject = (value: unknown): string =>
  JSON.stringify(value ?? {}, null, 2);

/** Parses editor text that must be a JSON object; blank means `{}`. */
export function parseJsonObject(text: string): JsonObjectParse {
  if (text.trim() === "") return { ok: true, value: {} };
  try {
    const parsed: unknown = JSON.parse(text);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return { ok: false, error: "باید یک شیء JSON باشد (داخل { })." };
    }
    return { ok: true, value: parsed as JsonRecord };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "JSON نامعتبر است.",
    };
  }
}
