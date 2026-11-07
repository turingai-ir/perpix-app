/* Tailwind class strings for the editor studio. The studio is always dark (`dark` scope). */

export const EDITOR_SCOPE_CLASS =
  "dark text-foreground [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-primary";

export const CHIP_BUTTON_CLASS =
  "min-h-11 cursor-pointer rounded-[11px] border border-foreground/15 bg-foreground/5 text-xs text-foreground/85 transition-colors hover-capable:hover:border-primary/50 hover-capable:hover:bg-primary/15 hover-capable:hover:text-foreground aria-pressed:border-primary/60 aria-pressed:bg-primary/15 aria-pressed:text-foreground disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none";
export const PRIMARY_BUTTON_CLASS =
  "flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/22 bg-primary px-4.5 text-[13px] font-extrabold text-primary-foreground shadow-[0_8px_26px_color-mix(in_srgb,var(--primary)_23%,transparent)] hover-capable:hover:brightness-110 max-md:px-3";
export const ICON_BUTTON_CLASS =
  "grid size-10 flex-none cursor-pointer place-items-center rounded-[11px] text-foreground/85 hover-capable:hover:bg-primary/14 hover-capable:hover:text-foreground aria-pressed:bg-primary/14 aria-pressed:text-foreground pointer-coarse:size-11";

export const FIELD_LABEL_CLASS = "text-xs font-bold text-foreground/85";
export const INPUT_LABEL_CLASS =
  "flex flex-col gap-2 text-xs font-bold text-foreground/85 [&_input]:w-full [&_input]:min-h-10 [&_input]:rounded-[10px] [&_input]:border [&_input]:border-foreground/19 [&_input]:bg-foreground/5 [&_input]:px-2.5 [&_input]:py-2 [&_input]:font-normal [&_input]:text-foreground [&_output]:w-full [&_output]:min-h-10 [&_output]:rounded-[10px] [&_output]:border [&_output]:border-foreground/19 [&_output]:bg-foreground/5 [&_output]:px-2.5 [&_output]:py-2 [&_output]:font-normal [&_output]:text-foreground [&_output]:block [&_output]:text-muted-foreground [&_textarea]:w-full [&_textarea]:min-h-10 [&_textarea]:rounded-[10px] [&_textarea]:border [&_textarea]:border-foreground/19 [&_textarea]:bg-foreground/5 [&_textarea]:px-2.5 [&_textarea]:py-2 [&_textarea]:font-normal [&_textarea]:text-foreground [&_textarea]:min-h-21 [&_textarea]:resize-y";
export const SLIDER_CLASS =
  "flex flex-col gap-3 text-xs [&>span]:flex [&>span]:items-center [&>span]:justify-between [&>span]:text-foreground/90 [&_b]:font-mono [&_b]:font-semibold [&_b]:text-primary [&_input]:w-full [&_input]:cursor-pointer [&_input]:accent-primary";
export const PANEL_CONTENT_CLASS =
  "mt-3 flex flex-col gap-2.5 md:mt-8 md:gap-4";
export const ACTION_ROW_CLASS = "mt-1 flex gap-2 *:flex-1";
export const SECONDARY_BUTTON_CLASS =
  "min-h-11 cursor-pointer rounded-[11px] border border-foreground/15 bg-foreground/5 text-xs text-foreground/85 transition-colors hover-capable:hover:border-primary/50 hover-capable:hover:bg-primary/15 hover-capable:hover:text-foreground aria-pressed:border-primary/60 aria-pressed:bg-primary/15 aria-pressed:text-foreground disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none px-3.5";

export const GRID_3_CLASS =
  "grid grid-cols-3 gap-2 [&_button]:min-h-11 [&_button]:cursor-pointer [&_button]:rounded-[11px] [&_button]:border [&_button]:border-foreground/15 [&_button]:bg-foreground/5 [&_button]:text-xs [&_button]:text-foreground/85 [&_button]:transition-colors [&_button]:hover-capable:hover:border-primary/50 [&_button]:hover-capable:hover:bg-primary/15 [&_button]:hover-capable:hover:text-foreground [&_button]:aria-pressed:border-primary/60 [&_button]:aria-pressed:bg-primary/15 [&_button]:aria-pressed:text-foreground [&_button]:disabled:cursor-not-allowed [&_button]:disabled:opacity-45 [&_button]:motion-reduce:transition-none [&_button]:min-h-10.5";
export const GRID_2_TABS_CLASS =
  "grid grid-cols-2 gap-2 [&_button]:min-h-11 [&_button]:cursor-pointer [&_button]:rounded-[11px] [&_button]:border [&_button]:border-foreground/15 [&_button]:bg-foreground/5 [&_button]:text-xs [&_button]:text-foreground/85 [&_button]:transition-colors [&_button]:hover-capable:hover:border-primary/50 [&_button]:hover-capable:hover:bg-primary/15 [&_button]:hover-capable:hover:text-foreground [&_button]:aria-pressed:border-primary/60 [&_button]:aria-pressed:bg-primary/15 [&_button]:aria-pressed:text-foreground [&_button]:disabled:cursor-not-allowed [&_button]:disabled:opacity-45 [&_button]:motion-reduce:transition-none";
export const SOCIAL_GRID_CLASS =
  "grid grid-cols-2 gap-2 [&_button]:min-h-11 [&_button]:cursor-pointer [&_button]:rounded-[11px] [&_button]:border [&_button]:border-foreground/15 [&_button]:bg-foreground/5 [&_button]:text-xs [&_button]:text-foreground/85 [&_button]:transition-colors [&_button]:hover-capable:hover:border-primary/50 [&_button]:hover-capable:hover:bg-primary/15 [&_button]:hover-capable:hover:text-foreground [&_button]:aria-pressed:border-primary/60 [&_button]:aria-pressed:bg-primary/15 [&_button]:aria-pressed:text-foreground [&_button]:disabled:cursor-not-allowed [&_button]:disabled:opacity-45 [&_button]:motion-reduce:transition-none [&_button]:flex [&_button]:flex-col [&_button]:items-start [&_button]:justify-center [&_button]:gap-1 [&_button]:px-2.5 [&_button]:py-2 [&_button]:text-start [&_button]:text-[11px] [&_button_span]:text-[10px] [&_button_span]:text-muted-foreground";
export const TRANSFORM_GRID_CLASS =
  "grid grid-cols-2 gap-2.5 [&_button]:min-h-11 [&_button]:cursor-pointer [&_button]:rounded-[11px] [&_button]:border [&_button]:border-foreground/15 [&_button]:bg-foreground/5 [&_button]:text-xs [&_button]:text-foreground/85 [&_button]:transition-colors [&_button]:hover-capable:hover:border-primary/50 [&_button]:hover-capable:hover:bg-primary/15 [&_button]:hover-capable:hover:text-foreground [&_button]:aria-pressed:border-primary/60 [&_button]:aria-pressed:bg-primary/15 [&_button]:aria-pressed:text-foreground [&_button]:disabled:cursor-not-allowed [&_button]:disabled:opacity-45 [&_button]:motion-reduce:transition-none [&_button]:flex [&_button]:h-21.5 [&_button]:flex-col [&_button]:items-center [&_button]:justify-center [&_button]:gap-2";
export const POSITION_GRID_CLASS =
  "grid grid-cols-[repeat(3,2.5rem)] gap-1.5 [&_button]:grid [&_button]:size-10 [&_button]:min-h-10 [&_button]:cursor-pointer [&_button]:place-items-center [&_button]:rounded-[9px] [&_button]:border [&_button]:border-foreground/16 [&_button]:bg-foreground/5 [&_button]:aria-pressed:border-primary [&_button]:aria-pressed:bg-primary/17 [&_button_span]:size-1.75 [&_button_span]:rounded-full [&_button_span]:bg-muted-foreground [&_button[aria-pressed=true]_span]:bg-primary ";

export const HEADER_GROUP_CLASS =
  "flex min-w-0 items-center gap-0.75 border-e border-foreground/13 px-0.5 min-[701px]:px-1.75 [&_button]:size-9.5 [&_button]:rounded-[11px] min-[701px]:[&_button]:size-10";

export const SIZE_PRESETS_CLASS =
  "grid grid-cols-3 gap-1.75 [&_button]:min-h-10 [&_button]:cursor-pointer [&_button]:rounded-[11px] [&_button]:border [&_button]:border-foreground/15 [&_button]:bg-foreground/5 [&_button]:text-xs [&_button]:text-foreground/85 [&_button]:transition-colors hover-capable:[&_button:hover]:border-primary/50 hover-capable:[&_button:hover]:bg-primary/15 [&_button[aria-pressed=true]]:border-primary/60 [&_button[aria-pressed=true]]:bg-primary/15 [&_button[aria-pressed=true]]:text-foreground";
