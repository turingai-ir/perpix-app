import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

/** Frosted bar used for the viewer's header and footer. */
export const viewerBarClass =
  "glass-blur relative z-3 flex min-w-0 flex-none items-center rounded-[1.25rem] border border-white/12 bg-[rgb(18_19_26/62%)] bg-[linear-gradient(135deg,rgb(255_255_255/9%),transparent_46%)] [--glass-saturate:150%] shadow-[inset_0_1px_rgb(255_255_255/13%),0_18px_48px_-28px_rgb(0_0_0/72%)] contrast-more:border-white/46 contrast-more:bg-[rgb(12_13_18/94%)] contrast-more:bg-none max-md:rounded-[1.1rem]";

/** Control styling for buttons and links that sit on the viewer's dark bars. */
export const viewerControlClass =
  "min-h-11 border-white/11 bg-white/5 text-white active:not-disabled:scale-[0.97] disabled:bg-transparent disabled:text-white/30";

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
