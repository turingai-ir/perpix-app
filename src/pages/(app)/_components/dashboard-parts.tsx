import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  tone?: "pink" | "blue";
  action?: ReactNode;
};

/** Eyebrow + title (+ optional link) at the top of every dashboard section. */
export function DashboardSectionHeader({
  eyebrow,
  title,
  titleId,
  tone = "pink",
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex min-w-0 items-end justify-between gap-4 max-[540px]:items-center">
      <div>
        <p
          className={cn(
            "text-xs font-semibold",
            tone === "pink" ? "text-(--image-accent)" : "text-(--video-accent)",
          )}
        >
          {eyebrow}
        </p>
        <h2
          id={titleId}
          className="text-foreground mt-1 text-lg font-semibold tracking-tight"
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
