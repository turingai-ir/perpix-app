/* Tailwind class strings for the image studio page shell. */

export const STUDIO_PAGE_CLASS = [
  "relative isolate flex min-h-[calc(100dvh-36px)] w-full min-w-0 flex-col overscroll-y-contain px-[clamp(12px,3vw,32px)] pt-3 pb-5 [-webkit-tap-highlight-color:transparent]",
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:content-[''] before:bg-background before:bg-[radial-gradient(ellipse_at_22%_18%,var(--ambient-brand),transparent_28rem),radial-gradient(ellipse_at_82%_54%,var(--ambient-media),transparent_32rem)]",
  "data-conversation:before:bg-[radial-gradient(ellipse_at_50%_12%,color-mix(in_srgb,var(--primary)_4%,transparent),transparent_30rem)]",
  "after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:animate-ambient-field after:opacity-35 after:content-[''] after:bg-[linear-gradient(28deg,transparent_49.7%,var(--ambient-brand)_50%,transparent_50.3%),linear-gradient(-32deg,transparent_49.7%,var(--ambient-media)_50%,transparent_50.3%)] after:bg-size-[7rem_6rem,9rem_8rem] after:bg-position-[0_0,1.5rem_2rem] after:mask-[radial-gradient(ellipse_at_center,transparent_8%,#000_74%)]",
  "data-conversation:after:animate-none data-conversation:after:opacity-0 motion-reduce:after:animate-none",
  "max-sm:min-h-[calc(100dvh-3rem)] max-sm:px-2.5 max-sm:pt-0 max-sm:pb-[max(12px,env(safe-area-inset-bottom))] max-sm:[&_input]:text-base max-sm:[&_select]:text-base max-sm:[&_textarea]:text-base",
  "pointer-coarse:[&_button]:min-h-11 pointer-coarse:[&_button]:min-w-11 pointer-coarse:[&_button]:touch-manipulation pointer-coarse:[&_button]:select-none pointer-coarse:[&_button]:transition-[transform,background-color,border-color] pointer-coarse:[&_button]:duration-150 pointer-coarse:[&_button:active:not(:disabled)]:scale-[0.97] pointer-coarse:[&_input]:touch-manipulation pointer-coarse:[&_select]:touch-manipulation pointer-coarse:[&_textarea]:touch-manipulation motion-reduce:[&_button]:transition-none",
].join(" ");

export const STUDIO_CONTENT_CLASS =
  "mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-end gap-[clamp(12px,2vh,24px)] max-sm:justify-start max-sm:gap-1";

export const STUDIO_INTRO_CLASS = [
  "relative isolate flex min-h-64 w-full flex-1 flex-col items-center justify-start gap-3 overflow-hidden px-4 pt-30 pb-4 text-center",
  "*:data-[slot=eyebrow]:relative *:data-[slot=eyebrow]:z-12 [&>h1]:relative [&>h1]:z-12 [&>p]:relative [&>p]:z-12",
  "max-h-[760px]:gap-2 max-h-[760px]:pb-1.5",
  "max-sm:h-[clamp(13rem,27svh,14.5rem)] max-sm:min-h-0 max-sm:flex-none max-sm:gap-1.5 max-sm:px-3 max-sm:pt-22 max-sm:pb-2",
  "max-sm:[&>h1]:max-w-88 max-sm:[&>h1]:text-[clamp(1.6rem,7vw,2rem)] max-sm:[&>h1]:leading-tight max-sm:[&>h1]:text-balance max-sm:[&>p]:max-w-84 max-sm:[&>p]:text-[0.8125rem] max-sm:[&>p]:leading-relaxed max-sm:[&>p]:text-balance",
  "max-sm:[&>span]:min-h-8 max-sm:[&>span]:bg-primary/10 max-sm:[&>span]:px-3 max-sm:[&>span]:backdrop-blur-md",
].join(" ");

export const STUDIO_DOCK_CLASS = [
  "sticky bottom-0 z-20 w-full pt-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pt-6",
  "max-sm:relative max-sm:pt-0 max-sm:pb-[max(0.375rem,env(safe-area-inset-bottom))]",
  "max-sm:[&_[data-generation-composer-card]]:rounded-3xl max-sm:[&_[data-generation-composer-card]]:border-foreground/10 max-sm:[&_[data-generation-composer-card]]:bg-card/82 max-sm:[&_[data-generation-composer-card]]:p-3 max-sm:[&_[data-generation-composer-card]]:shadow-[0_20px_56px_rgb(0_0_0/48%),inset_0_1px_rgb(255_255_255/5%)] max-sm:[&_[data-generation-composer-card]]:backdrop-blur-2xl max-sm:[&_[data-generation-composer-card]]:backdrop-saturate-115",
  "max-sm:[&_form]:gap-3 max-sm:[&_[data-generation-prompt-surface]]:min-h-23 max-sm:[&_[data-generation-prompt-surface]]:gap-2 max-sm:[&_[data-generation-prompt-surface]]:rounded-[1.125rem] max-sm:[&_[data-generation-prompt-surface]]:bg-foreground/3 max-sm:[&_[data-generation-prompt-surface]]:p-2",
].join(" ");
