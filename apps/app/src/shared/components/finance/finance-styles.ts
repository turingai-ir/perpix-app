/* Tailwind class strings shared by the payments and wallet pages. */

export const FINANCE_PAGE_CLASS =
  "isolate pb-12 [--finance-accent:var(--primary)] [--finance-accent-soft:color-mix(in_oklab,var(--primary)_16%,transparent)]";
export const FINANCE_PAGE_WALLET_CLASS =
  "[--finance-accent:var(--accent-teal)] [--finance-accent-soft:color-mix(in_oklab,var(--accent-teal)_16%,transparent)]";

export const FINANCE_ARCHIVE_CLASS =
  "mt-4 animate-finance-rise overflow-hidden rounded-[1.25rem] bg-card/92 shadow-[0_24px_55px_-44px_rgb(36_22_68/55%)] outline outline-border [animation-delay:180ms] motion-reduce:animate-none sm:mt-6 sm:rounded-3xl contrast-more:outline-2";
export const FINANCE_ARCHIVE_HEADING_CLASS =
  "flex items-start justify-between gap-4 p-4 sm:p-5 sm:px-6 [&_h2]:text-xl [&_h2]:leading-snug [&_h2]:font-extrabold [&_h2]:tracking-tight [&_p]:mt-2 [&_p]:max-w-[58ch] [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-muted-foreground";

export const FINANCE_CHIP_CLASS =
  "inline-flex min-h-11 items-center gap-2 rounded-[0.9rem] border border-white/16 bg-white/9 px-3.5 text-white shadow-[inset_0_1px_rgb(255_255_255/12%)] backdrop-blur-lg [&_strong]:tabular-nums [&_svg]:size-4 motion-safe:supports-[not(backdrop-filter:blur(1px))]:bg-white/20";

export const FINANCE_TABLE_SHELL_CLASS = "hidden overflow-x-auto lg:block";
export const FINANCE_TABLE_CLASS =
  "w-full text-[0.82rem] [&_td]:border-t [&_td]:border-border [&_td]:p-4 [&_td]:align-middle [&_th]:bg-muted/50 [&_th]:px-4 [&_th]:py-3.5 [&_th]:text-start [&_th]:font-semibold [&_th]:whitespace-nowrap [&_th]:text-muted-foreground [&_tbody_tr]:transition-colors [&_tbody_tr]:duration-150 hover-capable:[&_tbody_tr:hover]:bg-[color-mix(in_oklab,var(--finance-accent)_4%,transparent)] motion-reduce:[&_tbody_tr]:transition-none";
export const FINANCE_TABLE_ID_CLASS =
  "block max-w-40 overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap [direction:ltr]";

export const FINANCE_LIST_CLASS =
  "m-0 grid list-none grid-cols-1 gap-3 p-4 lg:hidden";
export const FINANCE_RECORD_CLASS =
  "min-w-0 rounded-[1.15rem] bg-[color-mix(in_oklab,var(--muted)_36%,var(--card))] p-4 outline outline-[color-mix(in_oklab,var(--border)_80%,transparent)] contrast-more:outline-2";
export const FINANCE_RECORD_ROW_CLASS =
  "flex flex-wrap items-center justify-between gap-3";
export const FINANCE_RECORD_AMOUNT_CLASS =
  "min-w-0 text-lg font-extrabold wrap-anywhere tabular-nums";
export const FINANCE_RECORD_META_CLASS = `${FINANCE_RECORD_ROW_CLASS} mt-4 text-xs text-muted-foreground`;
export const FINANCE_RECORD_FOOTER_CLASS =
  "mt-4 flex items-center justify-between gap-3 border-t border-border pt-3";
export const FINANCE_RECORD_ID_CLASS =
  "min-w-0 truncate font-mono text-xs [direction:ltr]";

export const FINANCE_STATUS_TONE_CLASS = {
  positive: "bg-success/13 text-success",
  pending: "bg-warning/14 text-warning",
  negative: "bg-destructive/12 text-destructive",
  review: "bg-review/13 text-review",
} as const;
