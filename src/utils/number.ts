import { jotaiStore } from "@/lib/jotai-store";
import { globalAtom } from "@/state";

type FormatLocalizedNumberParams = {
  value: number;
};

function exactInteger(value: string | number | bigint): bigint | null {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") {
    return Number.isSafeInteger(value) ? BigInt(value) : null;
  }
  return /^-?\d+$/.test(value) ? BigInt(value) : null;
}

function formatScaledInteger(
  value: string | number | bigint,
  divisor: bigint,
): string {
  const amount = exactInteger(value);
  if (amount === null) return "";
  return Intl.NumberFormat(jotaiStore.get(globalAtom).language).format(
    amount / divisor,
  );
}

export const formatTokenAmount = (
  amountUsdmicro: string | number | bigint,
): string => formatScaledInteger(amountUsdmicro, 1000n);

export const formatTomanAmount = (
  amountIrr: string | number | bigint,
): string => {
  const amount = exactInteger(amountIrr);
  if (amount === null) return "";
  const language = jotaiStore.get(globalAtom).language;
  const formatter = Intl.NumberFormat(language);
  const remainder = amount < 0n ? -(amount % 10n) : amount % 10n;
  const whole = formatter.format(amount / 10n);
  if (remainder === 0n) return whole;
  const decimal =
    Intl.NumberFormat(language)
      .formatToParts(1.1)
      .find((part) => part.type === "decimal")?.value ?? ".";
  const sign =
    amount < 0n && amount / 10n === 0n
      ? formatter
          .formatToParts(-1)
          .filter(
            (part) => part.type === "minusSign" || part.type === "literal",
          )
          .map((part) => part.value)
          .join("")
      : "";
  return `${sign}${whole}${decimal}${formatter.format(remainder)}`;
};

export function parseTokenAmount(value: string): number | null {
  const normalized = persianNumbersToEnglish(value);
  if (!/^\d+$/.test(normalized)) return null;
  const amount = BigInt(normalized) * 1000n;
  return amount <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(amount) : null;
}

export function formatLocalizedNumber({ value }: FormatLocalizedNumberParams) {
  if (typeof value !== "number") {
    return "";
  }

  return Intl.NumberFormat(jotaiStore.get(globalAtom).language, {
    maximumFractionDigits: 0,
  }).format(value);
}

export const persianNumbersToEnglish = (str: string) => {
  return str.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (char) => {
    const code = char.charCodeAt(0);
    // Persian digits: \u06F0 - \u06F9 → 0-9
    if (code >= 0x06f0 && code <= 0x06f9) {
      return (code - 0x06f0).toString();
    }
    // Arabic digits: \u0660 - \u0669 → 0-9
    if (code >= 0x0660 && code <= 0x0669) {
      return (code - 0x0660).toString();
    }
    return char;
  });
};
