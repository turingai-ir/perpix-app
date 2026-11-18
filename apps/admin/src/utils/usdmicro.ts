import { persianNumbersToEnglish } from "./number";

/**
 * The admin panel shows every amount in micro-dollars (1 USD = 1,000,000 µUSD),
 * the unit the server stores. The user app shows the same amounts as tokens:
 * one token is 1,000 µUSD.
 */
export const USDMICRO_PER_TOKEN = 1000;

export const USDMICRO_UNIT_LABEL = "میکرودلار";

const faFormatter = new Intl.NumberFormat("fa-IR", {
  useGrouping: true,
  maximumFractionDigits: 0,
});
const faTokenFormatter = new Intl.NumberFormat("fa-IR", {
  useGrouping: true,
  maximumFractionDigits: 3,
});

/** `12345` → `۱۲٬۳۴۵` */
export const formatUsdmicro = (amount: number | string | bigint): string => {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (typeof value === "number" && !Number.isFinite(value)) return "-";
  return faFormatter.format(value);
};

/** `12345` → `۱۲٫۳۴۵` tokens (exact: up to three decimals). */
export const formatTokensFromUsdmicro = (
  amount: number | string | bigint,
): string => {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "-";
  return faTokenFormatter.format(value / USDMICRO_PER_TOKEN);
};

/** The hint shown next to a micro-dollar amount, e.g. `≈ ۱۲ توکن`. */
export const tokenHint = (amount: number | string | bigint): string =>
  `≈ ${formatTokensFromUsdmicro(amount)} توکن`;

/**
 * Reads a micro-dollar amount typed by an admin. Accepts Persian/Arabic digits
 * and thousands separators; returns null for anything that is not a whole,
 * non-negative, safe integer.
 */
export const parseUsdmicro = (input: string): number | null => {
  const normalized = persianNumbersToEnglish(input).replace(/[,\s٬_]/g, "");
  if (!/^\d+$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isSafeInteger(value) ? value : null;
};
