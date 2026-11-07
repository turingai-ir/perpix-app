/* Tailwind class strings shared by the dashboard sections. */

/** Frosted glass; falls back to a solid surface on low-end/low-transparency setups. */
const GLASS_CLASS =
  "glass-blur [--glass-blur:24px] [--glass-saturate:145%] border border-(--glass-border) bg-(--glass-surface) shadow-[inset_0_1px_rgb(255_255_255/11%),inset_0_-1px_rgb(255_255_255/2%),0_24px_64px_-42px_rgb(0_0_0/82%)] in-data-[fx=lite]:bg-(--glass-surface-strong) in-data-[fx=lite]:backdrop-filter-none! contrast-more:border-foreground/34";

const GLASS_SHINE_CLASS =
  "before:pointer-events-none before:absolute before:top-0 before:left-[8%] before:h-px before:w-[58%] before:bg-linear-to-r before:from-transparent before:via-white/22 before:to-transparent before:content-['']";

export const DASHBOARD_PAGE_CLASS =
  "relative isolate min-h-full w-full overflow-hidden bg-background bg-[radial-gradient(circle_at_78%_-8%,var(--ambient-brand),transparent_30rem),radial-gradient(circle_at_8%_42%,var(--ambient-media),transparent_28rem)] text-foreground [-webkit-tap-highlight-color:transparent]";

export const DASHBOARD_GRID_CLASS =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(255_255_255/4%)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/4%)_1px,transparent_1px)] bg-size-[48px_48px] opacity-11 mask-[linear-gradient(to_bottom,black,transparent_72%)]";

export const DASHBOARD_AURORA_CLASS =
  "pointer-events-none absolute size-96 animate-drift rounded-full opacity-13 blur-[110px] motion-reduce:animate-none in-data-[fx=lite]:scale-160 in-data-[fx=lite]:blur-none in-data-[fx=lite]:mask-[radial-gradient(closest-side,#000,transparent)]";

export const DASHBOARD_SHELL_CLASS =
  "relative mx-auto w-full max-w-375 px-3 py-4 *:not-first:mt-6 sm:px-5 sm:py-6 xl:px-8";

export const DASHBOARD_HERO_CLASS = `${GLASS_CLASS} relative grid gap-6 overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,rgb(255_255_255/8%),transparent_44%)] p-5 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_0%,rgb(217_70_239/13%),transparent_42%)] before:content-[''] lg:block lg:p-8`;

export const DASHBOARD_GRID_LAYOUT_CLASS =
  "grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.75fr)]";

export const GLASS_PANEL_CLASS = `${GLASS_CLASS} ${GLASS_SHINE_CLASS} relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(145deg,rgb(255_255_255/6%),transparent_38%)] p-4 sm:p-5`;
export const CONTENT_WELL_CLASS = `${GLASS_CLASS} min-w-0 rounded-[1.75rem] bg-[linear-gradient(145deg,rgb(255_255_255/6%),transparent_38%)] p-4 *:not-first:mt-8 sm:p-5`;
export const RESUME_CARD_CLASS = `${GLASS_CLASS} ${GLASS_SHINE_CLASS} group relative flex min-h-20 items-center gap-4 overflow-hidden rounded-[1.25rem] bg-[linear-gradient(145deg,rgb(255_255_255/6%),transparent_38%)] p-3 transition-[transform,border-color,background-color] duration-200 ease-out-quint after:pointer-events-none after:absolute after:inset-y-0 after:left-0 after:w-[28%] after:bg-[radial-gradient(circle_at_left,rgb(217_70_239/12%),transparent_70%)] after:content-[''] hover-capable:hover:-translate-y-0.5 hover-capable:hover:border-(--image-accent)/26 sm:p-4 motion-reduce:transition-none motion-reduce:hover:translate-y-0`;

export const SECTION_LINK_CLASS =
  "inline-flex min-h-11 flex-none items-center gap-1 rounded-full border border-foreground/7 bg-foreground/3 px-3 text-xs text-muted-foreground transition-[color,border-color,background-color] duration-150 hover-capable:hover:border-foreground/14 hover-capable:hover:bg-foreground/6 hover-capable:hover:text-foreground motion-reduce:transition-none";

export const DATA_ROW_CLASS =
  "group flex min-w-0 items-center gap-3 rounded-[0.9rem] border border-transparent p-3 transition-[border-color,background-color] duration-150 hover-capable:hover:border-foreground/7 hover-capable:hover:bg-foreground/4 max-[540px]:px-2 motion-reduce:transition-none";
export const DATA_ICON_CLASS =
  "flex flex-none items-center justify-center border border-foreground/7 bg-linear-145 from-foreground/7 to-transparent shadow-[inset_0_1px_rgb(255_255_255/5%)]";

export const EMPTY_STATE_CLASS =
  "rounded-[0.9rem] border border-dashed border-foreground/11 bg-foreground/2 p-6 text-center text-sm text-muted-foreground";

export const METRIC_CARD_CLASS =
  "relative min-w-0 overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/2.5 bg-[linear-gradient(145deg,rgb(255_255_255/5%),transparent_45%)] p-4 shadow-[inset_0_1px_rgb(255_255_255/6%)] contrast-more:border-foreground/34";

export const DASHBOARD_FILE_CARD_CLASS =
  "group relative min-w-0 overflow-hidden rounded-[1.15rem] border border-foreground/8 bg-card shadow-[inset_0_1px_rgb(255_255_255/6%),0_18px_38px_-28px_rgb(0_0_0/80%)] transition-[transform,border-color,box-shadow] duration-200 ease-out-quint hover-capable:hover:-translate-y-0.75 hover-capable:hover:border-(--image-accent)/28 hover-capable:hover:shadow-[0_24px_48px_-32px_rgb(112_26_117/50%)] contrast-more:border-foreground/34 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export const DASHBOARD_FILE_MEDIA_CLASS =
  "size-full object-cover transition-[transform,filter] duration-200 ease-out-quint group-hover:scale-[1.025] group-hover:saturate-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100";

export const DASHBOARD_MODEL_CARD_CLASS =
  "group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/2 bg-[linear-gradient(135deg,rgb(255_255_255/6%),transparent_52%)] p-3 shadow-[inset_0_1px_rgb(255_255_255/6%)] transition-[transform,border-color,background-color] duration-200 ease-out-quint before:absolute before:inset-y-[20%] before:start-0 before:w-px before:rounded-full before:bg-linear-to-b before:from-transparent before:via-(--image-accent) before:to-transparent before:opacity-0 before:transition-opacity before:content-[''] hover-capable:hover:-translate-y-0.5 hover-capable:hover:border-(--image-accent)/28 hover-capable:hover:bg-foreground/5 hover-capable:hover:before:opacity-100 contrast-more:border-foreground/34 motion-reduce:transition-none motion-reduce:hover:translate-y-0";
