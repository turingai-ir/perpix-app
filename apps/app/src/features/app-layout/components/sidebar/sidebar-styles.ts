/* Shared Tailwind class strings for the sidebar. */

/** Frosted-glass surface shared by the desktop aside and the mobile sheet. */
export const SIDEBAR_SHELL_CLASS = [
  "isolate overflow-hidden border-(--glass-border) bg-sidebar/94 backdrop-blur-[30px] backdrop-saturate-[145%]",
  "bg-[radial-gradient(ellipse_at_90%_-8%,var(--ambient-brand),transparent_42%),radial-gradient(ellipse_at_-30%_54%,var(--ambient-media),transparent_48%)]",
  "shadow-[inset_-1px_0_var(--glass-highlight),inset_0_1px_var(--glass-highlight),var(--glass-shadow)]",
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:content-[''] before:bg-[linear-gradient(125deg,rgb(255_255_255/8%),transparent_28%),radial-gradient(circle_at_85%_0,rgb(250_136_255/13%),transparent_24%)]",
  "not-supports-[backdrop-filter:blur(1px)]:bg-sidebar not-supports-[backdrop-filter:blur(1px)]:bg-none",
].join(" ");

/** Press feedback for glass buttons/links; hover lift only on real pointers. */
export const GLASS_PRESS_CLASS =
  "transition-[background-color,border-color,transform] duration-200 ease-out-quint hover-capable:hover:-translate-y-px hover-capable:hover:border-foreground/25 hover-capable:hover:bg-foreground/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0";
