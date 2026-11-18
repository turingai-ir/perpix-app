import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

/** Frosted bar used for the viewer's header and footer. */
export const viewerBarClass =
  "glass-blur relative z-3 flex min-w-0 flex-none items-center rounded-2xl border border-night-foreground/12 bg-night/62 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--night-foreground)_9%,transparent),transparent_46%)] [--glass-saturate:150%] inset-shadow-highlight shadow-modal contrast-more:border-night-foreground/46 contrast-more:bg-night/94 contrast-more:bg-none max-md:rounded-xl";

/** Control styling for buttons and links that sit on the viewer's dark bars. */
export const viewerControlClass =
  "min-h-11 border-night-foreground/11 bg-night-foreground/5 text-night-foreground active:not-disabled:scale-[0.97] disabled:bg-transparent disabled:text-night-foreground/30";

export function GalleryViewerBar({
  as: Tag,
  className,
  children,
}: {
  as: "header" | "footer";
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={cn(viewerBarClass, className)}>{children}</Tag>;
}
