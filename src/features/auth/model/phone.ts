const PERSIAN_ZERO = 0x06f0;
const ARABIC_ZERO = 0x0660;

export function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);
    return String(
      code >= PERSIAN_ZERO ? code - PERSIAN_ZERO : code - ARABIC_ZERO,
    );
  });
}

const IRAN_MOBILE_PATTERN = /^(?:\+98|0098|98|0)?(9\d{9})$/;

/**
 * Converts user-friendly Iranian mobile input (09…, 98…, Persian digits, …)
 * to the canonical E.164 form the API requires, or `null` when invalid.
 */
export function toCanonicalIranMobile(input: string): string | null {
  const compact = toLatinDigits(input).replace(/[\s\-()]/g, "");
  const match = IRAN_MOBILE_PATTERN.exec(compact);

  return match ? `+98${match[1]}` : null;
}
