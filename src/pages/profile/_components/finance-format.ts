import { dayjs } from "@/lib/dayjs";
import { microDollarToToken } from "@/utils";

// Wallet units are 1/1000 of a token: retain precision in financial records.
export function financeNumber(value: number, locale: string, tokens = false) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: tokens ? 3 : 0,
  }).format(tokens ? microDollarToToken(value) : value);
}

export function financeDate(value: string) {
  const date = dayjs(value);
  return date.isValid()
    ? date.calendar("jalali").format("YYYY/MM/DD · HH:mm")
    : "—";
}

export function financeOffset(value: string | null) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 0;
}
