/* Shared Tailwind class strings for the image settings panel. */

export const SETTINGS_BORDER_CLASS =
  "border-[color-mix(in_srgb,var(--foreground)_13%,var(--border))] contrast-more:border-foreground";

/** Card surface used by the basic section and the professional disclosure. */
export const SETTINGS_CARD_CLASS =
  "rounded-2xl border border-[color-mix(in_srgb,var(--foreground)_13%,var(--border))] bg-card/68 p-3 shadow-[inset_0_1px_color-mix(in_srgb,var(--foreground)_7%,transparent),0_10px_28px_rgb(0_0_0/10%)] md:rounded-[18px] md:p-4 contrast-more:border-foreground";

export const SETTINGS_FIELD_CLASS = [
  "group/field relative rounded-2xl border border-[color-mix(in_srgb,var(--foreground)_15%,var(--border))] p-3.5 md:p-4",
  "bg-[color-mix(in_srgb,var(--background)_74%,var(--card))] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--foreground)_5%,transparent),transparent_48%)]",
  "shadow-[inset_0_1px_color-mix(in_srgb,var(--foreground)_8%,transparent),0_8px_20px_rgb(0_0_0/9%)] transition-[border-color,background-color,box-shadow] duration-200 motion-reduce:transition-none",
  "hover-capable:hover:border-[color-mix(in_srgb,var(--foreground)_23%,var(--border))]",
  "focus-within:border-[color-mix(in_srgb,var(--primary)_58%,var(--border))] focus-within:shadow-[inset_0_1px_color-mix(in_srgb,var(--foreground)_10%,transparent),0_0_0_3px_color-mix(in_srgb,var(--primary)_13%,transparent),0_12px_30px_color-mix(in_srgb,var(--primary)_9%,rgb(0_0_0/12%))]",
  "data-[changed=true]:border-[color-mix(in_srgb,var(--primary)_42%,var(--border))] data-[changed=true]:bg-[linear-gradient(145deg,color-mix(in_srgb,var(--primary)_9%,transparent),transparent_50%)]",
  "data-[invalid=true]:border-[color-mix(in_srgb,var(--destructive)_62%,var(--border))] data-[invalid=true]:shadow-[0_0_0_3px_color-mix(in_srgb,var(--destructive)_12%,transparent)]",
  "contrast-more:border-foreground",
  "[&_[data-slot=form-label]]:leading-loose [&_[data-slot=form-label]]:font-medium [&_[data-slot=form-label]]:whitespace-normal [&_[data-slot=form-label]]:text-foreground",
  "[&_[data-slot=form-description]]:mt-2 [&_[data-slot=form-description]]:text-[13px] [&_[data-slot=form-description]]:leading-loose [&_[data-slot=form-description]]:text-muted-foreground",
  "[&_input]:min-h-11 [&_input]:rounded-[10px] [&_input]:border-[color-mix(in_srgb,var(--foreground)_16%,var(--border))] [&_input]:bg-[color-mix(in_srgb,var(--background)_86%,var(--card))] max-md:[&_input]:text-base",
  "[&_textarea]:min-h-11 [&_textarea]:rounded-[10px] [&_textarea]:border-[color-mix(in_srgb,var(--foreground)_16%,var(--border))] [&_textarea]:bg-[color-mix(in_srgb,var(--background)_86%,var(--card))] [&_textarea]:text-sm [&_textarea]:leading-loose max-md:[&_textarea]:text-base",
  "[&_[data-slot=select-trigger]]:min-h-11 [&_[data-slot=select-trigger]]:rounded-[10px] [&_[data-slot=select-trigger]]:border-[color-mix(in_srgb,var(--foreground)_16%,var(--border))] [&_[data-slot=select-trigger]]:bg-[color-mix(in_srgb,var(--background)_86%,var(--card))] max-md:[&_[data-slot=select-trigger]]:text-base",
  "[&_input[type=number]]:text-start [&_input[type=number]]:tabular-nums [&_input[type=number]]:[direction:ltr]",
  "[&_[data-slot=checkbox]]:flex-none [&_[data-slot=form-item]>div:has(>[data-slot=checkbox])]:min-h-12 [&_[data-slot=form-item]>div:has(>[data-slot=checkbox])]:gap-3",
].join(" ");
