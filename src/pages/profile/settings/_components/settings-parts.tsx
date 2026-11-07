import type { ComponentProps, FC } from "react";

import { cn } from "@/shared/lib/utils";

const PANEL_CLASS =
  "rounded-3xl border border-(--glass-border) bg-(--glass-surface-strong) bg-[radial-gradient(ellipse_at_95%_-20%,color-mix(in_srgb,var(--primary)_24%,transparent),transparent_58%),radial-gradient(ellipse_at_-15%_110%,var(--ambient-media),transparent_55%),linear-gradient(135deg,var(--glass-surface-strong),var(--glass-surface))] shadow-[inset_0_1px_var(--glass-highlight),var(--glass-shadow)] backdrop-blur-xl backdrop-saturate-140";

/** Glass surface used by every card on the profile settings page. */
export const SettingsPanel: FC<ComponentProps<"section">> = ({
  className,
  ...props
}) => <section className={cn(PANEL_CLASS, className)} {...props} />;

export const SettingsAsidePanel: FC<ComponentProps<"aside">> = ({
  className,
  ...props
}) => <aside className={cn(PANEL_CLASS, className)} {...props} />;

export const SettingsEyebrow: FC<ComponentProps<"p">> = ({
  className,
  ...props
}) => (
  <p
    className={cn(
      "text-primary text-[0.68rem] font-extrabold tracking-widest uppercase",
      className,
    )}
    {...props}
  />
);

export const SettingsIconBox: FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "border-primary/20 bg-primary/13 text-primary grid size-11 flex-none place-items-center rounded-[0.9rem] border shadow-[inset_0_1px_rgb(255_255_255/10%)]",
      className,
    )}
    {...props}
  />
);
