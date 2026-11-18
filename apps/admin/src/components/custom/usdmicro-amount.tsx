import { cn } from "@/lib/utils";
import {
  USDMICRO_UNIT_LABEL,
  formatTokensFromUsdmicro,
  formatUsdmicro,
  parseUsdmicro,
  tokenHint,
} from "@/utils/usdmicro";

interface UsdmicroAmountProps {
  value: number | string | bigint | null | undefined;
  /** Where the token equivalent goes: under the amount, beside it, or nowhere. */
  hint?: "below" | "inline" | "none";
  className?: string;
  amountClassName?: string;
}

/**
 * An amount in micro-dollars with its token equivalent as a muted hint
 * (one token = 1,000 µUSD, as the user app shows it).
 */
export function UsdmicroAmount({
  value,
  hint = "below",
  className,
  amountClassName,
}: UsdmicroAmountProps) {
  if (value === null || value === undefined || value === "") {
    return <span className={cn("text-muted-foreground", className)}>-</span>;
  }

  const amount = (
    <span className={cn("tabular-nums", amountClassName)}>
      {formatUsdmicro(value)}{" "}
      <span className="text-muted-foreground text-[0.85em] font-normal">
        {USDMICRO_UNIT_LABEL}
      </span>
    </span>
  );
  const tokens = (
    <span className="text-muted-foreground text-[11px] font-normal tabular-nums">
      {tokenHint(value)}
    </span>
  );

  if (hint === "none") {
    return (
      <span className={className} title={tokenHint(value)}>
        {amount}
      </span>
    );
  }

  return (
    <span
      className={cn(
        hint === "below"
          ? "inline-flex flex-col gap-0.5"
          : "inline-flex flex-wrap items-baseline gap-x-1.5",
        className,
      )}
      title={tokenHint(value)}
    >
      {amount}
      {tokens}
    </span>
  );
}

/** The line under a micro-dollar input saying how many tokens the typed value is. */
export function UsdmicroInputHint({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const amount = value.trim() === "" ? null : parseUsdmicro(value);
  return (
    <p className={cn("text-muted-foreground text-[11px]", className)}>
      {amount === null
        ? `مبلغ را به ${USDMICRO_UNIT_LABEL} (عدد صحیح) وارد کنید؛ هر توکن = ۱٬۰۰۰ ${USDMICRO_UNIT_LABEL}`
        : `${formatUsdmicro(amount)} ${USDMICRO_UNIT_LABEL} ${tokenHint(amount)}`}
    </p>
  );
}

/** `before → after` in micro-dollars, with the token equivalents under it. */
export function BalanceChange({
  before,
  after,
}: {
  before: number;
  after: number;
}) {
  return (
    <span
      className="inline-flex flex-col gap-0.5 text-xs tabular-nums"
      title={`${tokenHint(before)} → ${formatTokensFromUsdmicro(after)} توکن`}
    >
      <span className="text-muted-foreground">
        {formatUsdmicro(before)} →{" "}
        <span className="text-foreground font-semibold">
          {formatUsdmicro(after)}
        </span>{" "}
        {USDMICRO_UNIT_LABEL}
      </span>
      <span className="text-muted-foreground text-[11px]">
        ≈ {formatTokensFromUsdmicro(before)} → {formatTokensFromUsdmicro(after)}{" "}
        توکن
      </span>
    </span>
  );
}
