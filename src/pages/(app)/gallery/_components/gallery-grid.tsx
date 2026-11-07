import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export function GalleryGrid({
  children,
  compact = false,
  hidden = false,
}: {
  children: ReactNode;
  compact?: boolean;
  hidden?: boolean;
}) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className={cn(
        "grid grid-cols-2 gap-[clamp(10px,1.7vw,22px)] max-[430px]:gap-2.5",
        compact
          ? "md:grid-cols-4 xl:grid-cols-5"
          : "md:grid-cols-3 xl:grid-cols-4",
      )}
    >
      {children}
    </div>
  );
}
